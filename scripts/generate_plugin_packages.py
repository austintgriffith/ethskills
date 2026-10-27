import argparse
import json
import posixpath
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote, urlsplit

VERSION = "3.0.0"
ETHSKILLS_BASE = "https://ethskills.com"

PACKAGE_SKILL_NAMES = {
    "eth-pilot": "pilot",
    "eth-architect": "architect",
    "eth-arena": "arena",
    "eth-audit-swarm": "audit-swarm",
    "eth-blast-radius": "blast-radius",
    "eth-correct": "correct",
    "eth-discover": "discover",
    "eth-help": "help",
    "eth-how": "how",
    "eth-reflect": "reflect",
    "eth-review": "review",
    "eth-swarm": "swarm",
    "eth-tdd": "tdd",
    "eth-teach": "teach",
    "eth-trace": "trace",
    "eth-verify": "verify",
    "eth-why": "why-project",
}

@dataclass(frozen=True)
class Distribution:
    host: str
    name: str
    catalog_groups: tuple[str, ...]
    package_root: Path
    skill_prefix: Path
    manifest_kind: str


DISTRIBUTIONS = (
    Distribution("claude", "ethskills", ("ethereum", "engineering"), Path("plugins/ethskills"), Path(), "claude"),
    Distribution("codex", "ethskills", ("ethereum", "engineering"), Path("plugins/codex/ethskills"), Path("skills"), "codex"),
)
CATALOG_GROUPS = {group for distribution in DISTRIBUTIONS for group in distribution.catalog_groups}
OBSOLETE_PACKAGE_ROOTS = (Path("plugins/eth-pilot"), Path("plugins/codex/eth-pilot"))
PACKAGE_EXCLUDED_FILES = {Path("eth-pilot/index.html")}
PACKAGE_DESCRIPTIONS = {
    "ethereum": "Ethereum protocol knowledge and engineering workflows for AI coding agents.",
    "engineering": "Ethereum protocol knowledge and engineering workflows for AI coding agents.",
}
PACKAGE_SUPPORT_ROOTS = {
    "engineering": ("tools/references",),
    "ethereum": (),
}
LINK_RE = re.compile(r"(?P<prefix>\]\()(?P<target><[^>]+>|[^\s)]+)(?P<suffix>\s+\"[^\"]*\")?\)")
FENCE_RE = re.compile(r"^```[^\n]*\n.*?^```[^\n]*(?:\n|$)", re.M | re.S)


def load_catalog(root):
    catalog = json.loads((root / "assets/catalog.json").read_text())
    by_id = {}
    for item in catalog:
        skill_id = item["id"]
        group = item["group"]
        if group not in CATALOG_GROUPS:
            raise ValueError(f"unsupported catalog group {group!r} for {skill_id}")
        if skill_id in by_id:
            raise ValueError(f"duplicate skill in catalog: {skill_id}")
        by_id[skill_id] = item
        if not (root / skill_id / "SKILL.md").is_file():
            raise ValueError(f"missing canonical skill: {skill_id}/SKILL.md")
    return catalog, by_id


def local_link_targets(path, root):
    text = FENCE_RE.sub("", path.read_text())
    for match in LINK_RE.finditer(text):
        target = match.group("target").strip("<>")
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        decoded_path = unquote(parsed.path)
        destination = (root / decoded_path.lstrip("/") if decoded_path.startswith("/") else path.parent / decoded_path).resolve()
        try:
            relative = destination.relative_to(root.resolve())
        except ValueError:
            continue
        if destination.exists():
            yield match, target, parsed, relative, destination
        else:
            raise ValueError(f"broken source link in {path.resolve().relative_to(root.resolve())}: {target}")


def skill_owner(relative, catalog_by_id):
    if not relative.parts or relative.parts[0] not in catalog_by_id:
        return None
    if relative.parts[:2] == ("tools", "references"):
        return None
    return relative.parts[0]


def stable_skill_url(relative, parsed, catalog_by_id):
    owner = skill_owner(relative, catalog_by_id)
    if owner is None:
        return None
    rest = relative.parts[1:]
    target_path = "/".join((owner, *rest)) if rest else f"{owner}/SKILL.md"
    return f"{ETHSKILLS_BASE}/{target_path}" + (f"#{parsed.fragment}" if parsed.fragment else "")


def package_relative_path(relative, catalog_by_id):
    owner = skill_owner(relative, catalog_by_id)
    if owner is None:
        return relative
    return Path(PACKAGE_SKILL_NAMES.get(owner, owner), *relative.parts[1:])


def render_markdown(path, root, groups, catalog_by_id):
    text = path.read_text()
    source_relative = path.relative_to(root)
    output_relative = package_relative_path(source_relative, catalog_by_id)
    owner = skill_owner(source_relative, catalog_by_id)
    if owner is not None and path.name == "SKILL.md":
        text = re.sub(r"(?m)^name:.*$", f"name: {PACKAGE_SKILL_NAMES.get(owner, owner)}", text, count=1)
    spans = []
    for match, target, parsed, relative, _ in local_link_targets(path, root):
        target_owner = skill_owner(relative, catalog_by_id)
        if relative == Path("SKILL.md"):
            replacement = f"{ETHSKILLS_BASE}/SKILL.md" + (f"#{parsed.fragment}" if parsed.fragment else "")
        elif target_owner is not None and catalog_by_id[target_owner]["group"] not in groups:
            replacement = stable_skill_url(relative, parsed, catalog_by_id)
        else:
            target_relative = package_relative_path(relative, catalog_by_id)
            replacement = posixpath.relpath(target_relative.as_posix(), output_relative.parent.as_posix())
            if parsed.fragment:
                replacement += f"#{parsed.fragment}"
        if replacement:
            spans.append((match.start("target"), match.end("target"), f"<{replacement}>" if target.startswith("<") else replacement))
    for start, end, replacement in reversed(spans):
        text = text[:start] + replacement + text[end:]
    return text


def package_files(root, distribution, catalog, catalog_by_id):
    groups = set(distribution.catalog_groups)
    skill_ids = [item["id"] for item in catalog if item["group"] in groups]
    files = set()
    for skill_id in skill_ids:
        skill_root = root / skill_id
        files.update(
            path
            for path in skill_root.rglob("*")
            if path.is_file()
            and path.relative_to(root) not in PACKAGE_EXCLUDED_FILES
            and "evals" not in path.relative_to(skill_root).parts
            and not (skill_id == "tools" and path.is_relative_to(root / "tools/references"))
        )
    for support_root in (path for group in groups for path in PACKAGE_SUPPORT_ROOTS[group]):
        support_path = root / support_root
        if not support_path.exists():
            raise ValueError(f"missing required package support path: {support_root}")
        files.update(path for path in support_path.rglob("*") if path.is_file() and path.suffix.lower() == ".md")
    queue = [path for path in files if path.suffix.lower() == ".md"]
    visited = set()
    while queue:
        path = queue.pop()
        if path in visited:
            continue
        visited.add(path)
        for _, _, _, relative, destination in local_link_targets(path, root):
            owner = skill_owner(relative, catalog_by_id)
            if owner is not None:
                if catalog_by_id[owner]["group"] not in groups:
                    continue
                continue
            if relative == Path("SKILL.md"):
                continue
            if destination.is_dir():
                linked = {child for child in destination.rglob("*") if child.is_file()}
            else:
                linked = {destination}
            files.update(linked)
            queue.extend(item for item in linked if item.suffix.lower() == ".md")

    output = {}
    for path in sorted(files):
        relative = path.relative_to(root)
        if skill_owner(relative, catalog_by_id) and catalog_by_id[skill_owner(relative, catalog_by_id)]["group"] not in groups:
            raise ValueError(f"cross-package skill file copied into package: {relative}")
        if path.suffix.lower() == ".md":
            content = render_markdown(path, root, groups, catalog_by_id).encode()
        else:
            content = path.read_bytes()
        output[distribution.skill_prefix / package_relative_path(relative, catalog_by_id)] = content

    manifest = {
        "name": distribution.name,
        "version": VERSION,
        "description": PACKAGE_DESCRIPTIONS["ethereum"],
        "author": {"name": "Austin Griffith"},
        "homepage": "https://ethskills.com",
        "repository": "https://github.com/austintgriffith/ethskills",
        "license": "MIT",
        "skills": [f"./{PACKAGE_SKILL_NAMES.get(skill_id, skill_id)}" for skill_id in skill_ids] if distribution.manifest_kind == "claude" else "./skills/",
    }
    manifest_path = Path(f".{distribution.manifest_kind}-plugin/plugin.json")
    output[manifest_path] = (
        json.dumps(
            manifest,
            indent=2,
        )
        + "\n"
    ).encode()
    return output


def generate(root):
    catalog, catalog_by_id = load_catalog(root)
    return {
        distribution.package_root: package_files(root, distribution, catalog, catalog_by_id)
        for distribution in DISTRIBUTIONS
    }


def check_outputs(root, generated):
    errors = []
    for obsolete in OBSOLETE_PACKAGE_ROOTS:
        if (root / obsolete).exists():
            errors.append(f"obsolete generated package is still present: {obsolete}")
    for package_path, expected in generated.items():
        package_root = root / package_path
        actual = {
            path.relative_to(package_root): path.read_bytes()
            for path in package_root.rglob("*")
            if path.is_file()
        } if package_root.exists() else {}
        for path in sorted(set(expected) - set(actual)):
            errors.append(f"generated file is missing: {package_path}/{path}")
        for path in sorted(set(actual) - set(expected)):
            errors.append(f"generated file is stale: {package_path}/{path}")
        for path in sorted(set(expected) & set(actual)):
            if expected[path] != actual[path]:
                errors.append(f"generated file is out of date: {package_path}/{path}")
    return errors


def write_outputs(root, generated):
    for obsolete in OBSOLETE_PACKAGE_ROOTS:
        obsolete_path = root / obsolete
        if obsolete_path.exists():
            shutil.rmtree(obsolete_path)
    for package_path, files in generated.items():
        package_root = root / package_path
        if package_root.exists():
            shutil.rmtree(package_root)
        for relative, content in files.items():
            destination = package_root / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(content)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail if committed plugin output differs")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.root.resolve()
    try:
        generated = generate(root)
    except (KeyError, ValueError, json.JSONDecodeError) as error:
        print(error)
        return 1
    if args.check:
        errors = check_outputs(root, generated)
        if errors:
            print("\n".join(errors))
            return 1
        print("Generated plugin packages are up to date.")
        return 0
    write_outputs(root, generated)
    print("Generated Claude Code and Codex plugin packages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
