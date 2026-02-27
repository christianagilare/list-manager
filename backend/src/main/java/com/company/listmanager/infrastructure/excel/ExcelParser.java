package com.company.listmanager.infrastructure.excel;

import com.company.listmanager.application.result.RowError;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class ExcelParser {

    private static final int MAX_NOMBRES = 500;
    private static final int MAX_DNI = 50;
    private static final int MAX_PAIS = 100;
    private static final int MAX_WALLET = 200;
    private static final int MAX_OFICIO = 1000;

    private static final String COL_NOMBRES = "nombresCompletos";
    private static final String COL_DNI = "dni";
    private static final String COL_PAIS = "paisOrigen";
    private static final String COL_WALLET = "wallet";
    private static final String COL_OFICIO = "oficioJustificacion";

    public ExcelParseResult parse(InputStream inputStream) {
        List<ExcelRowData> validRows = new ArrayList<>();
        List<RowError> errors = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                errors.add(new RowError(0, "", "No se encontró ninguna hoja"));
                return new ExcelParseResult(validRows, errors);
            }

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                errors.add(new RowError(0, "", "Cabecera vacía"));
                return new ExcelParseResult(validRows, errors);
            }

            int colNombres = findColumnIndex(headerRow, COL_NOMBRES, "nombres completos");
            int colDni = findColumnIndex(headerRow, COL_DNI, "dni");
            int colPais = findColumnIndex(headerRow, COL_PAIS, "pais origen");
            int colWallet = findColumnIndex(headerRow, COL_WALLET, "wallet");
            int colOficio = findColumnIndex(headerRow, COL_OFICIO, "oficio justificacion");

            if (colNombres < 0 || colDni < 0 || colPais < 0 || colWallet < 0 || colOficio < 0) {
                errors.add(new RowError(1, "", "Faltan columnas requeridas: nombresCompletos, dni, paisOrigen, wallet, oficioJustificacion"));
                return new ExcelParseResult(validRows, errors);
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String nombres = getCellString(row.getCell(colNombres));
                String dni = getCellString(row.getCell(colDni));
                String pais = getCellString(row.getCell(colPais));
                String wallet = getCellString(row.getCell(colWallet));
                String oficio = getCellString(row.getCell(colOficio));

                List<RowError> rowErrors = validateRow(i + 1, nombres, dni, pais, wallet, oficio);
                if (rowErrors.isEmpty()) {
                    validRows.add(new ExcelRowData(nombres.trim(), dni.trim(), pais.trim(), wallet.trim(), oficio.trim()));
                } else {
                    errors.addAll(rowErrors);
                }
            }
        } catch (Exception e) {
            errors.add(new RowError(0, "", "Error leyendo archivo: " + e.getMessage()));
        }

        return new ExcelParseResult(validRows, errors);
    }

    private int findColumnIndex(Row headerRow, String exactName, String alternativeName) {
        for (int i = 0; i < headerRow.getLastCellNum(); i++) {
            String cellVal = getCellString(headerRow.getCell(i));
            if (cellVal != null && (cellVal.trim().equalsIgnoreCase(exactName) || cellVal.trim().replace(" ", "").equalsIgnoreCase(alternativeName.replace(" ", "")))) {
                return i;
            }
        }
        return -1;
    }

    private String getCellString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    private List<RowError> validateRow(int rowNum, String nombres, String dni, String pais, String wallet, String oficio) {
        List<RowError> errs = new ArrayList<>();
        if (isBlank(nombres)) errs.add(new RowError(rowNum, COL_NOMBRES, "nombresCompletos no puede estar vacío"));
        else if (nombres.length() > MAX_NOMBRES)
            errs.add(new RowError(rowNum, COL_NOMBRES, "nombresCompletos máximo " + MAX_NOMBRES + " caracteres"));

        if (isBlank(dni)) errs.add(new RowError(rowNum, COL_DNI, "dni no puede estar vacío"));
        else if (dni.length() > MAX_DNI)
            errs.add(new RowError(rowNum, COL_DNI, "dni máximo " + MAX_DNI + " caracteres"));

        if (isBlank(pais)) errs.add(new RowError(rowNum, COL_PAIS, "paisOrigen no puede estar vacío"));
        else if (pais.length() > MAX_PAIS)
            errs.add(new RowError(rowNum, COL_PAIS, "paisOrigen máximo " + MAX_PAIS + " caracteres"));

        if (isBlank(wallet)) errs.add(new RowError(rowNum, COL_WALLET, "wallet no puede estar vacío"));
        else if (wallet.length() > MAX_WALLET)
            errs.add(new RowError(rowNum, COL_WALLET, "wallet máximo " + MAX_WALLET + " caracteres"));

        if (isBlank(oficio)) errs.add(new RowError(rowNum, COL_OFICIO, "oficioJustificacion no puede estar vacío"));
        else if (oficio.length() > MAX_OFICIO)
            errs.add(new RowError(rowNum, COL_OFICIO, "oficioJustificacion máximo " + MAX_OFICIO + " caracteres"));

        return errs;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
