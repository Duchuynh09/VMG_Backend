export class ProductionDto {
    date: Date;
    stepId: string;
    quantity: number;
    workedHours: number;
}
// dto cho việc cập nhật thông tin người dùng
export class UpdateWorkerProfileDto {
    fullName: string;
    birthDate?: Date;
    phone?: string;
    address?: string;
    citizenId?: string;
    user: string
}
export class UpdateProductivityDto {
    date: string;
    productCode: string;
    operationId: string;
    amount: number;
    isPrimary?: boolean;
}
