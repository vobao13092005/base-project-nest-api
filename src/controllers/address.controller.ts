import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { Address } from "src/entities/address.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { apiResponse } from "src/helpers/response.helper";
import { AddressService } from "src/services/database/address.service";

@Controller('addresses')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) { }

  // Sửa địa chỉ
  @Put(':addressId')
  async update(@Param('addressId') addressId: string, @Body() body: Address) {
    await this.addressService.update(+addressId, body);
    return apiResponse('Đã cập nhật địa chỉ');
  }

  // Xoá địa chỉ
  @Delete(':addressId')
  async delete(@Param('addressId') addressId: string) {
    await this.addressService.delete(+addressId);
    return apiResponse('Đã xoá địa chỉ');
  }

  // Lấy địa chỉ theo ID
  @Get(':addressId')
  async getAddressById(@Param('addressId') addressId: string) {
    const address = await this.addressService.findByField({ addressId: +addressId });
    return apiResponse('Chi tiết địa chỉ', address);
  }
}