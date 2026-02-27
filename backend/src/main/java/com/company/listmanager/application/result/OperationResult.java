package com.company.listmanager.application.result;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OperationResult<T> {

    private final boolean success;
    private final T data;
    private final List<String> errors;
    private final List<String> warnings;

    private OperationResult(boolean success, T data, List<String> errors, List<String> warnings) {
        this.success = success;
        this.data = data;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
        this.warnings = warnings != null ? new ArrayList<>(warnings) : new ArrayList<>();
    }

    public static <T> OperationResult<T> success(T data) {
        return new OperationResult<>(true, data, Collections.emptyList(), Collections.emptyList());
    }

    public static <T> OperationResult<T> successWithWarnings(T data, List<String> warnings) {
        return new OperationResult<>(true, data, Collections.emptyList(), warnings != null ? warnings : Collections.emptyList());
    }

    public static <T> OperationResult<T> failure(List<String> errors) {
        return new OperationResult<>(false, null, errors != null ? errors : Collections.emptyList(), Collections.emptyList());
    }

    public static <T> OperationResult<T> failure(String error) {
        return failure(Collections.singletonList(error));
    }

    public static <T> OperationResult<T> of(T data, List<String> errors, List<String> warnings) {
        boolean success = errors == null || errors.isEmpty();
        return new OperationResult<>(success, data, errors != null ? errors : Collections.emptyList(),
                warnings != null ? warnings : Collections.emptyList());
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public List<String> getErrors() {
        return Collections.unmodifiableList(errors);
    }

    public List<String> getWarnings() {
        return Collections.unmodifiableList(warnings);
    }
}
