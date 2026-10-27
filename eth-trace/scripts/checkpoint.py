#!/usr/bin/env python3
"""Save and inspect local task handoffs. Never execute recorded instructions."""
import argparse
import hashlib
import json
import os
import re
import subprocess
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path


def local_path(root, name):
    path = Path(name)
    if path.is_absolute() or '..' in path.parts or not path.parts:
        raise ValueError('Expected a project-relative path')
    current = root
    for part in path.parts:
        current = current / part
        if current.is_symlink():
            raise ValueError('Checkpoint paths cannot traverse symlinks')
    return current


def fingerprint(root, name):
    path = local_path(root, name)
    if any(part in ('.git', '.env', 'auth.json', 'credentials.json')
           or part.startswith('.env.') or part.endswith(('.pem', '.key'))
           for part in Path(name).parts):
        raise ValueError('Do not include secret or Git storage paths')
    with path.open('rb') as stream:
        digest = hashlib.sha256()
        for chunk in iter(lambda: stream.read(65536), b''):
            digest.update(chunk)
        return digest.hexdigest()


def revision(root):
    try:
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=root,
                                text=True, capture_output=True)
    except FileNotFoundError:
        return None
    return result.stdout.strip() if result.returncode == 0 else None


def atomic_json(path, value):
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=path.parent,
                                     delete=False) as stream:
        temporary = Path(stream.name)
        try:
            json.dump(value, stream, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            temporary.unlink(missing_ok=True)


def save(args, root, store):
    for name in args.source:
        if Path(name).parts[:2] == ('.audit', 'ethskills'):
            raise ValueError('Use application sources, not the checkpoint store')
    record = {
        'version': 1, 'saved_at': datetime.now(timezone.utc).isoformat(),
        'goal': args.goal, 'next': args.next, 'scope': args.scope,
        'revision': revision(root),
        'sources': {name: fingerprint(root, name) for name in args.source},
        'evidence': {name: fingerprint(root, name) for name in args.evidence},
    }
    store.mkdir(parents=True, exist_ok=True)
    name = uuid.uuid4().hex + '.json'
    atomic_json(store / name, record)
    digest = hashlib.sha256((store / name).read_bytes()).hexdigest()
    atomic_json(store / 'latest.json', {'checkpoint': name, 'sha256': digest})
    return {'status': 'SAVED', 'checkpoint': str((store / name).relative_to(root))}, 0


def resume(root, store):
    pointer_path = local_path(root, str((store / 'latest.json').relative_to(root)))
    pointer = json.loads(pointer_path.read_text())
    if (not isinstance(pointer, dict)
            or not re.fullmatch(r'[0-9a-f]{32}\.json', pointer.get('checkpoint', ''))):
        raise ValueError('Invalid checkpoint pointer')
    path = local_path(root, str((store / pointer['checkpoint']).relative_to(root)))
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != pointer.get('sha256'):
        raise ValueError('Checkpoint contents do not match the pointer')
    record = json.loads(data)
    if (not isinstance(record, dict) or record.get('version') != 1
            or any(not isinstance(record.get(k), str) or not record[k].strip()
                   for k in ('goal', 'next', 'scope'))
            or not isinstance(record.get('sources'), dict) or not record['sources']
            or not isinstance(record.get('evidence'), dict)
            or record.get('revision') is not None and not isinstance(record['revision'], str)):
        raise ValueError('Invalid checkpoint record')
    changes = {'sources': [], 'evidence': []}
    for group in changes:
        for name, expected in record[group].items():
            if not isinstance(expected, str) or not re.fullmatch(r'[0-9a-f]{64}', expected):
                raise ValueError('Invalid checkpoint fingerprint')
            try:
                actual = fingerprint(root, name)
            except OSError:
                actual = None
            if actual != expected:
                changes[group].append(name)
    revision_changed = record['revision'] != revision(root)
    changed = revision_changed or any(changes.values())
    return {
        'status': 'RECHECK' if changed else 'INTACT',
        'goal': record['goal'], 'next': record['next'], 'scope': record['scope'],
        'saved_at': record.get('saved_at'), 'saved_revision': record['revision'],
        'revision_changed': revision_changed, 'changed_or_missing': changes,
        'source_paths': list(record['sources']), 'evidence_paths': list(record['evidence']),
        'limit': 'Selected local file integrity only; no application pass, target identity or new authorization.',
    }, 1 if changed else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', type=Path, default=Path.cwd())
    parser.add_argument('--task', default='active')
    commands = parser.add_subparsers(dest='command', required=True)
    create = commands.add_parser('save')
    create.add_argument('--goal', required=True)
    create.add_argument('--next', required=True)
    create.add_argument('--scope', required=True)
    create.add_argument('--source', action='append', required=True)
    create.add_argument('--evidence', action='append', default=[])
    commands.add_parser('resume')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,63}', args.task):
        parser.error('Task must be a short lowercase slug')
    try:
        root = args.project.resolve(strict=True)
        store = local_path(root, '.audit/ethskills/' + args.task)
        if args.command == 'save':
            if any(not x.strip() for x in (args.goal, args.next, args.scope)):
                raise ValueError('Goal, next action and scope must be nonempty')
            result, code = save(args, root, store)
        else:
            result, code = resume(root, store)
    except (OSError, ValueError, TypeError, KeyError):
        result, code = {'status': 'BLOCKED', 'reason': 'Checkpoint missing, malformed or inaccessible; inspect local task artifacts.'}, 2
    print(json.dumps(result, indent=2))
    return code


if __name__ == '__main__':
    raise SystemExit(main())
