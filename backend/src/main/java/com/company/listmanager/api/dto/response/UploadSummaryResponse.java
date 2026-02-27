package com.company.listmanager.api.dto.response;

import com.company.listmanager.application.result.RowError;

import java.util.List;
import java.util.stream.Collectors;

public class UploadSummaryResponse {
    private int totalRows;
    private int insertedRows;
    private int rejectedRows;
    private List<RowErrorDto> errors;

    public record RowErrorDto(int row, String column, String message) {
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getInsertedRows() {
        return insertedRows;
    }

    public void setInsertedRows(int insertedRows) {
        this.insertedRows = insertedRows;
    }

    public int getRejectedRows() {
        return rejectedRows;
    }

    public void setRejectedRows(int rejectedRows) {
        this.rejectedRows = rejectedRows;
    }

    public List<RowErrorDto> getErrors() {
        return errors;
    }

    public void setErrors(List<RowErrorDto> errors) {
        this.errors = errors;
    }

    public static List<RowErrorDto> fromRowErrors(List<RowError> errors) {
        if (errors == null) return List.of();
        return errors.stream()
                .map(e -> new RowErrorDto(e.row(), e.column(), e.message()))
                .collect(Collectors.toList());
    }
}
