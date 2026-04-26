import { vi } from 'vitest';

export const debugDrawer = {
    addShape: vi.fn(),
    removeShape: vi.fn(),
};

export class DebugShape {
    remove = vi.fn(() => debugDrawer.removeShape(this));
}
export class DebugText extends DebugShape {}
export class DebugBox extends DebugShape {}
export class DebugLine extends DebugShape {}