
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../enums/role.enum';

// Tạo key cho role admin để k bị đánh cắp dữ liệu
export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
