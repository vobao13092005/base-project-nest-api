import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { apiError } from "src/helpers/response.helper";
import { Address } from "src/entities/address.entity";

@Injectable()
export class AddressService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }
  async findByField(data: Partial<Address>): Promise<Address | null> {
    const address = await this.entityManager.findOne(Address, data);
    return address;
  }
  async update(addressId: number, address: Address) {
    const addressEntity = await this.findByField({ addressId: addressId });
    if (!addressEntity) {
      throw apiError('Không tìm thấy địa chỉ');
    }
    this.entityManager.assign(addressEntity, address);
    await this.entityManager.flush();
  }
  async delete(addressId: number) {
    const addressEntity = await this.entityManager.findOneOrFail(Address, { addressId });
    await this.entityManager.removeAndFlush(addressEntity);
  }
}