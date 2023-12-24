import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class WebClientService {
  private axiosInstance = axios.create({
    // 基本配置
    baseURL: 'https://payment-stage.ecpay.com.tw/Cashier',
    timeout: 3000,
  });

  async get(url: string, config?: AxiosRequestConfig) {
    try {
      return await this.axiosInstance.get(url, config);
    } catch (error) {
      console.log(error);
    }
  }

  async postForm(url: string, data: any) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      return await this.axiosInstance.post(url, data, config);
    } catch (error) {
      console.log(error);
    }
  }
}
