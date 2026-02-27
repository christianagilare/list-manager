package com.company.listmanager.application.result;

public record RowError(int row, String column, String message) {
}
