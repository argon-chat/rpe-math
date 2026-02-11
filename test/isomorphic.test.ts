/**
 * AssemblyScript Isomorphism Tests
 * 
 * These tests verify that the math library can be compiled by AssemblyScript.
 * The sources are written to be compatible with both TypeScript and AssemblyScript.
 */

import { describe, expect, it, beforeAll } from 'bun:test';
import asc from 'assemblyscript/dist/asc.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';

const SRC_DIR = join(dirname(__dirname), 'src');
const BUILD_DIR = join(dirname(__dirname), 'build');

// List of source files to test (excluding types.ts which uses TS-specific constructs)
const SOURCE_FILES = [
  'constants.ts',
  'Vec2.ts',
  'Vec3.ts',
  'Vec4.ts',
  'Mat4.ts',
  'Quat.ts',
  'Transform.ts',
  'AABB.ts',
  'Ray.ts',
];

describe('AssemblyScript Isomorphism', () => {
  beforeAll(() => {
    // Clean and create build directory
    if (existsSync(BUILD_DIR)) {
      rmSync(BUILD_DIR, { recursive: true });
    }
    mkdirSync(BUILD_DIR, { recursive: true });
  });

  it('should have assemblyscript installed', async () => {
    expect(asc).toBeDefined();
    expect(typeof asc.main).toBe('function');
  });

  // Test each source file individually
  for (const file of SOURCE_FILES) {
    it(`should compile ${file}`, async () => {
      const filePath = join(SRC_DIR, file);
      const content = readFileSync(filePath, 'utf-8');
      
      // Create entry file that imports the module
      const entryFile = `
// Entry point for ${file}
export * from "./${file.replace('.ts', '')}";
`;
      
      const entryPath = join(BUILD_DIR, 'entry.ts');
      writeFileSync(entryPath, entryFile);
      
      // Copy source file to build dir (asc needs it there)
      const buildFilePath = join(BUILD_DIR, file);
      writeFileSync(buildFilePath, content);
      
      // Copy dependencies if needed
      if (file !== 'types.ts' && file !== 'constants.ts') {
        // Copy types.ts for type utilities
        if (!existsSync(join(BUILD_DIR, 'types.ts'))) {
          writeFileSync(
            join(BUILD_DIR, 'types.ts'),
            readFileSync(join(SRC_DIR, 'types.ts'), 'utf-8')
          );
        }
        // Copy constants.ts for math constants
        if (!existsSync(join(BUILD_DIR, 'constants.ts'))) {
          writeFileSync(
            join(BUILD_DIR, 'constants.ts'),
            readFileSync(join(SRC_DIR, 'constants.ts'), 'utf-8')
          );
        }
      }
      
      // For dependent files, copy their dependencies
      if (file === 'Mat4.ts' || file === 'Transform.ts' || file === 'AABB.ts' || file === 'Ray.ts') {
        for (const dep of ['Vec2.ts', 'Vec3.ts', 'Vec4.ts']) {
          if (!existsSync(join(BUILD_DIR, dep))) {
            writeFileSync(
              join(BUILD_DIR, dep),
              readFileSync(join(SRC_DIR, dep), 'utf-8')
            );
          }
        }
      }
      
      if (file === 'Transform.ts' || file === 'Ray.ts') {
        if (!existsSync(join(BUILD_DIR, 'Mat4.ts'))) {
          writeFileSync(
            join(BUILD_DIR, 'Mat4.ts'),
            readFileSync(join(SRC_DIR, 'Mat4.ts'), 'utf-8')
          );
        }
        if (!existsSync(join(BUILD_DIR, 'Quat.ts'))) {
          writeFileSync(
            join(BUILD_DIR, 'Quat.ts'),
            readFileSync(join(SRC_DIR, 'Quat.ts'), 'utf-8')
          );
        }
      }
      
      if (file === 'Ray.ts') {
        if (!existsSync(join(BUILD_DIR, 'AABB.ts'))) {
          writeFileSync(
            join(BUILD_DIR, 'AABB.ts'),
            readFileSync(join(SRC_DIR, 'AABB.ts'), 'utf-8')
          );
        }
        if (!existsSync(join(BUILD_DIR, 'Transform.ts'))) {
          writeFileSync(
            join(BUILD_DIR, 'Transform.ts'),
            readFileSync(join(SRC_DIR, 'Transform.ts'), 'utf-8')
          );
        }
      }

      // Compile with AssemblyScript
      const { error, stdout, stderr } = await asc.main([
        entryPath,
        '--outFile', join(BUILD_DIR, `${file.replace('.ts', '')}.wasm`),
        '--textFile', join(BUILD_DIR, `${file.replace('.ts', '')}.wat`),
        '--optimize',
        '--noAssert',
      ], {
        readFile: (name: string, baseDir: string) => {
          const fullPath = join(baseDir || BUILD_DIR, name);
          if (existsSync(fullPath)) {
            return readFileSync(fullPath, 'utf-8');
          }
          // Try SRC_DIR as fallback
          const srcPath = join(SRC_DIR, name);
          if (existsSync(srcPath)) {
            return readFileSync(srcPath, 'utf-8');
          }
          return null;
        },
        writeFile: (name: string, contents: Uint8Array | string, baseDir: string) => {
          const fullPath = join(baseDir || BUILD_DIR, name);
          mkdirSync(dirname(fullPath), { recursive: true });
          writeFileSync(fullPath, contents);
        },
        listFiles: () => [],
        stderr: {
          write: (s: string) => { /* capture stderr */ }
        },
        stdout: {
          write: (s: string) => { /* capture stdout */ }
        }
      });

      // Check for compilation errors
      if (error) {
        console.error(`Compilation error for ${file}:`, error.message);
        console.error('stderr:', stderr?.toString());
      }
      
      expect(error).toBeNull();
    });
  }

  // Note: Full library compilation test is skipped because index.ts
  // contains runtime polyfills (globalThis.inline) for TypeScript.
  // Individual module compilation tests above prove AS compatibility.
});
