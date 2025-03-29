import { Injectable } from '@angular/core';

export interface ParameterOption {
  value: number;
  price: number;
}

export interface ParameterConfig {
  key: string;
  options: ParameterOption[];
}

export interface PricingMapping {
  [key: string]: { [value: number]: number };
}

@Injectable()
export class CalculatePriceService {
  private pricingMapping: PricingMapping = {};

  public parameterConfigs: ParameterConfig[] = [];

  public initParameterConfigs(serverData: any[]): void {
    this.parameterConfigs = serverData.map((item) => {
      const key = item.key;

      if (!this.pricingMapping[key]) {
        this.pricingMapping[key] = {};
        item.values.forEach((val: string) => {
          const numericVal = Number(val);
          this.pricingMapping[key][numericVal] = 0;
        });
      }

      const options: ParameterOption[] = item.values.map((val: string) => {
        const numericVal = Number(val);
        return {
          value: numericVal,
          price: this.getPriceForParameter(key, numericVal),
        };
      });
      return { key, options };
    });
  }

  private setPriceForParameter(
    parameterKey: string,
    value: number,
    price: number
  ): void {
    if (!this.pricingMapping[parameterKey]) {
      this.pricingMapping[parameterKey] = {};
    }
    this.pricingMapping[parameterKey][value] = price;
  }

  public updatePrice(parameterKey: string, value: number, price: number): void {
    this.setPriceForParameter(parameterKey, value, price);
    const config = this.parameterConfigs.find((c) => c.key === parameterKey);
    if (config) {
      const option = config.options.find((o) => o.value === value);
      if (option) {
        option.price = price;
      }
    }
  }

  public getPriceForParameter(parameterKey: string, value: number): number {
    return this.pricingMapping[parameterKey]?.[value] || 0;
  }

  public computeDifference(
    parameterKey: string,
    baseValue: number,
    optionValue: number
  ): number {
    const basePrice = this.getPriceForParameter(parameterKey, baseValue);
    const optionPrice = this.getPriceForParameter(parameterKey, optionValue);
    return optionPrice - basePrice;
  }
}
