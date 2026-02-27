package com.company.listmanager.api.advice;

import com.company.listmanager.api.dto.response.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                request.getDescription(false).replace("uri=", ""),
                "VALIDATION_ERROR",
                "Error de validación",
                details
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                request.getDescription(false).replace("uri=", ""),
                "BAD_REQUEST",
                ex.getMessage(),
                null
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUpload(MaxUploadSizeExceededException ex, WebRequest request) {
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                request.getDescription(false).replace("uri=", ""),
                "PAYLOAD_TOO_LARGE",
                "Archivo demasiado grande",
                null
        );
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, WebRequest request) {
        log.error("Unhandled exception", ex);
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                request.getDescription(false).replace("uri=", ""),
                "INTERNAL_ERROR",
                "Error interno del servidor",
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
