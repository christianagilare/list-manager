package com.company.listmanager.api.controller;

import com.company.listmanager.api.dto.response.ErrorResponse;
import com.company.listmanager.api.dto.response.UploadSummaryResponse;
import com.company.listmanager.application.result.OperationResult;
import com.company.listmanager.application.usecase.UploadExcelUseCase;
import com.company.listmanager.domain.model.TipoLista;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/uploads")
@Tag(name = "Uploads", description = "Carga masiva y metadatos")
public class UploadController {

    private static final Logger log = LoggerFactory.getLogger(UploadController.class);

    private final UploadExcelUseCase uploadExcelUseCase;

    public UploadController(UploadExcelUseCase uploadExcelUseCase) {
        this.uploadExcelUseCase = uploadExcelUseCase;
    }

    @PostMapping(value = "/{tipoLista}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Cargar Excel")
    public ResponseEntity<?> upload(@PathVariable TipoLista tipoLista,
                                    @RequestParam("file") MultipartFile file) throws IOException {
        log.info("Upload recibido: tipoLista={}, file={}, size={} bytes", tipoLista, file.getOriginalFilename(), file.getSize());
        if (file.isEmpty()) {
            log.warn("Upload rechazado: archivo vacío");
            return ResponseEntity.badRequest().body(new ErrorResponse(
                    java.time.Instant.now(), "", "BAD_REQUEST", "Archivo vacío", null));
        }
        byte[] bytes = file.getBytes();
        OperationResult<UploadExcelUseCase.UploadSummary> result = uploadExcelUseCase.execute(bytes, file.getOriginalFilename(), tipoLista, "Anonimo");

        UploadSummaryResponse response = new UploadSummaryResponse();
        response.setTotalRows(result.getData().totalRows());
        response.setInsertedRows(result.getData().insertedRows());
        response.setRejectedRows(result.getData().rejectedRows());
        response.setErrors(UploadSummaryResponse.fromRowErrors(result.getData().errors()));

        log.info("Upload procesado: totalRows={}, inserted={}, rejected={}", response.getTotalRows(), response.getInsertedRows(), response.getRejectedRows());
        return ResponseEntity.ok(response);
    }
}
