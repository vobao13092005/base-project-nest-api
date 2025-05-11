import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DateTimeService } from './daytime.service';
import { InsertPaymentData } from 'src/controllers/payment.controller';
const crypto = require("crypto");
const qs = require('qs');


/*
Thẻ test
9704198526191432198
NGUYEN VAN A
07/15
123456
*/

@Injectable()
export class PaymentService {
  private tmnCode = 'OWPQI289';
  private secretKey = 'H2VS2ENXJBJIPTFN2UT1U7YCAOM8G0XE';
  private vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private returnUrl = 'http://localhost:3000/payment/return';

  constructor(
    private readonly dateTimeService: DateTimeService,
  ) { }

  getIpAddress(request: Request) {
    let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || '127.0.0.1';
    if (ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';
    return ip;
  }

  createPaymentUrl(request: Request, data: InsertPaymentData): string {
    const orderId = this.dateTimeService.dateFormat(this.dateTimeService.getDateInGMT7(), 'ddHHmmss').toString();
    const createDay = this.dateTimeService.dateFormat(this.dateTimeService.getDateInGMT7(), 'yyyyMMddHHmmss');

    let paymentUrl = this.vnpUrl;
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = data.amount * 100;
    vnp_Params['vnp_ReturnUrl'] = this.returnUrl;
    vnp_Params['vnp_IpAddr'] = this.getIpAddress(request);
    vnp_Params['vnp_CreateDate'] = createDay;

    vnp_Params = this.sortObject(vnp_Params);

    let queryString = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto
      .createHmac('SHA512', this.secretKey)
      .update(queryString)
      .digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    paymentUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return paymentUrl;
  }

  sortObject(obj: { [key: string]: string | number }): { [key: string]: string } {
    let sorted: { [key: string]: string } = {};
    let str: string[] = [];
    let key: string;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (let index = 0; index < str.length; index++) {
      sorted[str[index]] = encodeURIComponent(obj[str[index]] as string).replace(/%20/g, "+");
    }
    return sorted;
  }

  generateRandomString(
    length: number,
    options?: {
      onlyNumber?: boolean;
    },
  ) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (options?.onlyNumber) {
      characters = '0123456789';
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += `${characters[(Math.random() * charactersLength) | 0]}`;
    }
    return result;
  }

}
