import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/checkpoint.py'


class CheckpointTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'source.txt').write_text('first implementation')
        (self.root / 'proof.txt').write_text('observed result')

    def call(self, *args):
        result = subprocess.run([sys.executable, str(SCRIPT), *args], cwd=self.root,
                                text=True, capture_output=True)
        self.assertFalse(result.stderr, result.stderr)
        return result.returncode, json.loads(result.stdout)

    def save(self, *extra):
        return self.call('save', '--goal', 'Finish feature', '--next', 'Inspect proof',
                         '--scope', 'Local tests only', '--source', 'source.txt',
                         '--evidence', 'proof.txt', *extra)

    def test_fresh_process_recovers_goal_next_and_scope(self):
        self.assertEqual(self.save()[0], 0)
        code, value = self.call('resume')
        self.assertEqual(code, 0)
        self.assertEqual(value['status'], 'INTACT')
        self.assertEqual(value['next'], 'Inspect proof')
        self.assertEqual(value['scope'], 'Local tests only')

    def test_changed_source_and_missing_proof_require_recheck(self):
        self.save()
        (self.root / 'source.txt').write_text('changed implementation')
        (self.root / 'proof.txt').unlink()
        code, value = self.call('resume')
        self.assertEqual(code, 1)
        self.assertEqual(value['changed_or_missing'],
                         {'sources': ['source.txt'], 'evidence': ['proof.txt']})

    def test_failed_save_preserves_previous_checkpoint(self):
        self.save()
        before = (self.root / '.audit/ethskills/active/latest.json').read_bytes()
        (self.root / 'proof.txt').unlink()
        self.assertEqual(self.save()[0], 2)
        self.assertEqual((self.root / '.audit/ethskills/active/latest.json').read_bytes(), before)

    def test_corrupted_record_is_not_trusted(self):
        _, value = self.save()
        (self.root / value['checkpoint']).write_text('{}')
        self.assertEqual(self.call('resume')[0], 2)

    def test_symlinked_pointer_is_not_followed(self):
        self.save()
        pointer = self.root / '.audit/ethskills/active/latest.json'
        original = pointer.read_text()
        pointer.unlink()
        (self.root / 'external-pointer.json').write_text(original)
        pointer.symlink_to(self.root / 'external-pointer.json')
        self.assertEqual(self.call('resume')[0], 2)

    def test_paths_cannot_escape_or_read_symlinks(self):
        (self.root / 'link').symlink_to(self.root / 'source.txt')
        for path in ['../outside', '/etc/hosts', 'link', '.env']:
            with self.subTest(path=path):
                self.assertEqual(self.save('--source', path)[0], 2)

    def test_named_tasks_are_independent_and_saved_actions_are_data(self):
        self.assertEqual(self.call('--task', 'other', 'save', '--goal', 'Other',
                                  '--next', 'touch SHOULD_NOT_EXIST', '--scope', 'No writes',
                                  '--source', 'source.txt')[0], 0)
        self.assertEqual(self.call('resume')[0], 2)
        code, value = self.call('--task', 'other', 'resume')
        self.assertEqual(code, 0)
        self.assertEqual(value['next'], 'touch SHOULD_NOT_EXIST')
        self.assertFalse((self.root / 'SHOULD_NOT_EXIST').exists())


if __name__ == '__main__':
    unittest.main()
