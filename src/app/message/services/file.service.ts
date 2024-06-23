import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }
  extractNamesFromExcel(file: File): Promise<{ customers: { name: string[], phoneNumber: string[] }[] }> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
  
      reader.onload = (e: any) => {
        try {
          const workbook: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName: string = workbook.SheetNames[0];
          const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  
          // Check if '!ref' property exists in sheet
          if (!sheet['!ref']) {
            reject('Sheet range is undefined.');
            return;
          }
  
          // Get the dimensions of the sheet
          const range = XLSX.utils.decode_range(sheet['!ref']);
  
          // Assuming names are in column A starting from row 2
          const namesColumn: XLSX.CellObject[] = XLSX.utils.sheet_to_json(sheet, {
            range: { s: { r: 1, c: 0 }, e: { r: range.e.r, c: 0 } },
            header: 1,
            raw: false,
          });
  
          const phoneNumbersColumn: XLSX.CellObject[] = XLSX.utils.sheet_to_json(sheet, {
            range: { s: { r: 1, c: 1 }, e: { r: range.e.r, c: 1 } },
            header: 1,
            raw: false,
          });
  
          // Extract values from the column, excluding rows with empty name or phone number
          const customers: { name: string[], phoneNumber: string[] }[] = namesColumn
            .map((cell, index) => ({
              name: [cell[0]?.toString() || ''].filter(Boolean), // Exclude empty names
              phoneNumber: [phoneNumbersColumn[index][0]?.toString() || ''].filter(Boolean), // Exclude empty phone numbers
            }))
            .filter(customer => customer.name.length > 0 && customer.phoneNumber.length > 0);
  
          resolve({ customers });
        } catch (error) {
          reject(error);
        }
      };
  
      reader.readAsBinaryString(file);
    });
  }
  
  
  
  

}
