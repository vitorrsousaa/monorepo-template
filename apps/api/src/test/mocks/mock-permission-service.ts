import type { IPermissionService } from "@data/protocols/sharing/permission-service";

export function mockPermissionService(
	overrides?: Partial<IPermissionService>,
): IPermissionService {
	return {
		requireRole: vi.fn(),
		...overrides,
	};
}
