import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class CBSFileOpService<T> {
  async readDataFromFile(dataFilePath: string): Promise<T[]> {
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      return JSON.parse(fileContent) as unknown as T[];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error reading from file: ${error}`,
      );
    }
  }

  async writeDataToFile(data: T[], dataFilePath: string): Promise<void> {
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException(`Error writing to file: ${error}`);
    }
  }
}
