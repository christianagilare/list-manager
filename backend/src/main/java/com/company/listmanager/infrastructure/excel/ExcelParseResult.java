package com.company.listmanager.infrastructure.excel;

import com.company.listmanager.application.result.RowError;

import java.util.ArrayList;
import java.util.List;

public record ExcelParseResult(List<ExcelRowData> validRows, List<RowError> errors) {
    public ExcelParseResult(List<ExcelRowData> validRows, List<RowError> errors) {
        this.validRows = validRows != null ? new ArrayList<>(validRows) : new ArrayList<>();
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
    }
}
