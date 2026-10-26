import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

import yaml

from generate_plugin_packages import PACKAGE_SKILL_NAMES, DISTRIBUTIONS, check_outputs, generate

PACKAGE_COUNTS = {"ethereum": 22, "engineering": 17}
VERSION = "3.0.0"
CANONICAL_SKILL_NAMES = {"why": "why-ethereum"}


def markdown_targets(text):
    text = re.sub(r"^```[^\n]*\n.*?^```[^\n]*(?:\n|$)", "", text, flags=re.M | re.S)
    return re.findall(r"\[[^\]\n]*\]\(([^\s)]+)(?:\s+\"[^\"]*\")?\)", text)


def validate_package(root, distribution, expected_ids, catalog_by_id, marketplace_entries, errors):
    package_name = distribution.name
    package_root = root / distribution.package_root
    skills_root = package_root / distribution.skill_prefix
    manifest_path = package_root / f".{distribution.manifest_kind}-plugin/plugin.json"
    if not manifest_path.is_file():
        errors.append(f"missing generated plugin manifest: {manifest_path.relative_to(root)}")
        return
    try:
        manifest = json.loads(manifest_path.read_text())
    except json.JSONDecodeError as exc:
        errors.append(f"invalid plugin manifest for {package_name}: {exc}")
        return
    if not isinstance(manifest, dict):
        errors.append(f"plugin manifest must be an object: {manifest_path.relative_to(root)}")
        return

    if manifest.get("name") != package_name:
        errors.append(f"plugin manifest name mismatch: {package_name}")
    if manifest.get("version") != VERSION:
        errors.append(f"plugin manifest version must be {VERSION}: {package_name}")
    expected_registration = (
        [f"./{PACKAGE_SKILL_NAMES.get(skill_id, skill_id)}" for skill_id in expected_ids]
        if distribution.manifest_kind == "claude"
        else "./skills/"
    )
    registered = manifest.get("skills")
    if registered != expected_registration:
        errors.append(f"plugin skill paths do not match the {distribution.catalog_groups} catalog groups: {distribution.package_root}")
    if isinstance(registered, list) and len(registered) != len(set(registered)):
        errors.append(f"plugin registers duplicate skill paths: {package_name}")

    actual_skill_dirs = {
        child.name
        for child in skills_root.iterdir()
        if child.is_dir() and (child / "SKILL.md").is_file()
    } if skills_root.is_dir() else set()
    expected_package_names = {PACKAGE_SKILL_NAMES.get(skill_id, skill_id) for skill_id in expected_ids}
    if actual_skill_dirs != expected_package_names:
        errors.append(
            f"package skill directories do not match catalog groups {distribution.catalog_groups}: "
            f"expected {sorted(expected_package_names)}, found {sorted(actual_skill_dirs)}"
        )

    for skill_id in expected_ids:
        skill_package_name = PACKAGE_SKILL_NAMES.get(skill_id, skill_id)
        skill_path = skills_root / skill_package_name / "SKILL.md"
        if not skill_path.is_file():
            continue
        text = skill_path.read_text()
        front = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
        if not front:
            errors.append(f"missing package skill frontmatter: {skill_path.relative_to(root)}")
            continue
        try:
            metadata = yaml.safe_load(front[1])
        except yaml.YAMLError as exc:
            errors.append(f"invalid package skill YAML: {skill_id}: {exc}")
            continue
        if not isinstance(metadata, dict) or metadata.get("name") != skill_package_name:
            errors.append(f"package skill name differs from directory: {distribution.package_root}/{skill_package_name}")

    for path in package_root.rglob("*.json"):
        try:
            json.loads(path.read_text())
        except json.JSONDecodeError as exc:
            errors.append(f"invalid package JSON: {path.relative_to(root)}: {exc}")

    for path in package_root.rglob("*.md"):
        for target in markdown_targets(path.read_text()):
            url = urlsplit(target.strip("<>"))
            if url.netloc == "ethskills.com" and url.path.startswith("/"):
                linked_skill = url.path.strip("/").split("/", 1)[0]
                item = catalog_by_id.get(linked_skill)
                canonical_target = root / unquote(url.path).lstrip("/")
                if item and item["group"] not in distribution.catalog_groups and not canonical_target.exists():
                    errors.append(f"cross-package URL is not a stable skill path: {path.relative_to(root)} -> {target}")
            if url.scheme or url.netloc or not url.path:
                continue
            destination = (package_root / unquote(url.path).lstrip("/") if url.path.startswith("/") else path.parent / unquote(url.path)).resolve()
            try:
                destination.relative_to(package_root.resolve())
            except ValueError:
                errors.append(f"package link escapes bundle: {path.relative_to(root)} -> {target}")
                continue
            if not destination.exists():
                errors.append(f"broken package-local link: {path.relative_to(root)} -> {target}")

    for entry in marketplace_entries:
        if entry.get("name") != package_name:
            continue
        source = entry.get("source")
        if distribution.host == "claude":
            if entry.get("version") != VERSION:
                errors.append(f"marketplace version must be {VERSION}: {package_name}")
            expected_source = {
                "source": "git-subdir",
                "url": "austintgriffith/ethskills",
                "path": str(distribution.package_root),
            }
        else:
            expected_source = {"source": "local", "path": f"./{distribution.package_root}"}
            if entry.get("policy") != {"installation": "AVAILABLE", "authentication": "ON_INSTALL"}:
                errors.append(f"Codex marketplace policy is invalid: {package_name}")
            if not isinstance(entry.get("category"), str) or not entry["category"]:
                errors.append(f"Codex marketplace category is missing: {package_name}")
        if source != expected_source:
            errors.append(f"marketplace source path is wrong for {distribution.host}/{package_name}")


def validate(root):
    errors = []
    marketplaces = {}
    for host, path in (
        ("claude", root / ".claude-plugin/marketplace.json"),
        ("codex", root / ".agents/plugins/marketplace.json"),
    ):
        try:
            marketplace = json.loads(path.read_text())
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"invalid {host} marketplace manifest: {exc}")
            continue
        if not isinstance(marketplace, dict):
            errors.append(f"{host} marketplace must be an object")
            continue
        entries = marketplace.get("plugins", [])
        if not isinstance(entries, list) or not all(isinstance(entry, dict) for entry in entries):
            errors.append(f"{host} marketplace plugins must be a list of objects")
            continue
        expected_names = [distribution.name for distribution in DISTRIBUTIONS if distribution.host == host]
        names = [entry.get("name") for entry in entries]
        if names != expected_names:
            errors.append(f"{host} marketplace must list ethskills exactly once")
        if host == "claude" and not isinstance(marketplace.get("metadata"), dict):
            errors.append("Claude marketplace metadata must be an object")
        elif host == "claude" and marketplace["metadata"].get("version") != VERSION:
            errors.append(f"marketplace metadata version must be {VERSION}")
        if host == "codex":
            if marketplace.get("name") != "ethskills":
                errors.append("Codex marketplace name must be ethskills")
            interface = marketplace.get("interface")
            if not isinstance(interface, dict) or not isinstance(interface.get("displayName"), str):
                errors.append("Codex marketplace needs interface.displayName")
        marketplaces[host] = entries
    if (root / ".claude-plugin/plugin.json").exists():
        errors.append("remove the former combined .claude-plugin/plugin.json manifest")

    catalog = json.loads((root / "assets/catalog.json").read_text())
    identifiers = [item["id"] for item in catalog]
    skill_ids = set(identifiers)
    if len(identifiers) != len(skill_ids):
        errors.append("website catalog must contain every canonical skill exactly once")
    for skill_id in skill_ids:
        if not (root / skill_id / "SKILL.md").is_file():
            errors.append(f"catalog skill is missing its canonical source: {skill_id}/SKILL.md")
    catalog_by_id = {item["id"]: item for item in catalog}
    for item in catalog:
        if not item.get("title") or not item.get("description"):
            errors.append(f"website skill needs title and description: {item['id']}")
        expected_group = "engineering" if item["id"].startswith("eth-") else "ethereum"
        if item.get("group") != expected_group:
            errors.append(f"wrong website skill group: {item['id']}")

    for group, count in PACKAGE_COUNTS.items():
        actual_count = sum(item["group"] == group for item in catalog)
        if actual_count != count:
            errors.append(f"catalog group {group} must contain {count} skills")
    for distribution in DISTRIBUTIONS:
        expected_ids = [item["id"] for item in catalog if item["group"] in distribution.catalog_groups]
        validate_package(
            root, distribution, expected_ids, catalog_by_id,
            marketplaces.get(distribution.host, []), errors,
        )

    try:
        generated = generate(root)
        errors.extend(check_outputs(root, generated))
    except (KeyError, ValueError, json.JSONDecodeError) as exc:
        errors.append(f"cannot generate plugin packages: {exc}")

    for skill_id in sorted(skill_ids):
        path = root / skill_id / "SKILL.md"
        text = path.read_text()
        front = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
        if not front:
            errors.append(f"missing frontmatter: {path.relative_to(root)}")
            continue
        try:
            metadata = yaml.safe_load(front[1])
        except yaml.YAMLError as exc:
            errors.append(f"invalid YAML: {path.relative_to(root)}: {exc}")
            continue
        if not isinstance(metadata, dict):
            errors.append(f"metadata is not a mapping: {path.relative_to(root)}")
            continue
        for field in ("name", "description"):
            if not isinstance(metadata.get(field), str) or not metadata[field].strip():
                errors.append(f"missing string {field}: {path.relative_to(root)}")
        expected_name = PACKAGE_SKILL_NAMES.get(skill_id, CANONICAL_SKILL_NAMES.get(skill_id, skill_id))
        if metadata.get("name") != expected_name:
            errors.append(f"skill name differs from directory: {path.relative_to(root)}")

    for alias in ("AGENTS.md", "CLAUDE.md", "llms.txt"):
        path = root / alias
        if not path.is_symlink() or path.readlink() != Path("SKILL.md"):
            errors.append(f"preserve {alias} -> SKILL.md symlink")

    documents = set(root.glob("eth-*/**/*.md"))
    documents.update(root.glob("tools/references/*.md"))
    documents.update(root.glob("docs/guide/*.md"))
    documents.update(root / path for path in ("SKILL.md", "README.md", "NOTICE.md"))
    for path in sorted(documents):
        if not path.is_file():
            errors.append(f"missing document: {path.relative_to(root)}")
            continue
        for target in markdown_targets(path.read_text()):
            url = urlsplit(target.strip("<>"))
            if url.scheme or url.netloc or not url.path:
                continue
            decoded = unquote(url.path)
            destination = root / decoded.lstrip("/") if decoded.startswith("/") else path.parent / decoded
            if not destination.exists():
                errors.append(f"broken local link: {path.relative_to(root)} -> {target}")

    for path in root.glob("eth-*/**/*.json"):
        try:
            json.loads(path.read_text())
        except json.JSONDecodeError as exc:
            errors.append(f"invalid JSON: {path.relative_to(root)}: {exc}")

    pages = json.loads((root / "docs/guide/navigation.json").read_text())
    page_ids = [page["id"] for page in pages]
    if len(page_ids) != len(set(page_ids)) or "start" not in page_ids:
        errors.append("guide needs unique chapter IDs and a start chapter")
    if len({page["file"] for page in pages}) != len(pages):
        errors.append("guide navigation repeats a Markdown source")
    for page in pages:
        if not re.fullmatch(r"[a-z0-9-]+", page["id"]):
            errors.append(f"invalid guide ID: {page['id']}")
        if Path(page["file"]).name != page["file"] or not page["file"].endswith(".md"):
            errors.append(f"guide source must be a Markdown filename: {page['file']}")
        if not (root / "docs/guide" / page["file"]).is_file():
            errors.append(f"missing guide source: {page['file']}")

    class PageLinks(HTMLParser):
        def handle_starttag(self, tag, attributes):
            for name, value in attributes:
                if name not in ("href", "src") or not value:
                    continue
                url = urlsplit(value)
                if url.scheme or url.netloc or not url.path:
                    continue
                path = root / unquote(url.path).lstrip("/") if url.path.startswith("/") else current.parent / unquote(url.path)
                if not path.exists():
                    errors.append(f"broken website link: {current.relative_to(root)} -> {value}")

    for current in (root / "index.html", root / "guide/index.html"):
        PageLinks().feed(current.read_text())
    for asset in json.loads((root / "assets/vendor/versions.json").read_text()):
        path = root / "assets/vendor" / asset["file"]
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != asset["sha256"]:
            errors.append(f"vendored asset checksum mismatch: {asset['file']}")
        if not (root / "assets/vendor" / asset["license_file"]).is_file():
            errors.append(f"missing vendored license: {asset['license_file']}")
    return errors, len(skill_ids), len(documents)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    errors, skills, documents = validate(args.root.resolve())
    if errors:
        for error in errors:
            print(error)
        return 1
    print(f"Validated {skills} canonical skills and {documents} Markdown documents.")
    print("Generated packages match the catalog and have valid local links.")
    print("Structural validation only; no agent behavior or dApp execution is certified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
