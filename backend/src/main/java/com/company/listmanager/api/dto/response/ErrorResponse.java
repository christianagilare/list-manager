package com.company.listmanager.api.dto.response;

import java.time.Instant;
import java.util.List;

public class ErrorResponse {
    private Instant timestamp;
    private String path;
    private String code;
    private String message;
    private List<String> details;

    public ErrorResponse() {
    }

    public ErrorResponse(Instant timestamp, String path, String code, String message, List<String> details) {
        this.timestamp = timestamp;
        this.path = path;
        this.code = code;
        this.message = message;
        this.details = details;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}
