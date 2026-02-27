package com.company.listmanager.application.usecase;

import com.company.listmanager.application.port.out.EntryRepositoryPort;
import com.company.listmanager.application.port.out.FileUploadRepositoryPort;
import com.company.listmanager.application.result.OperationResult;
import com.company.listmanager.application.result.RowError;
import com.company.listmanager.domain.model.*;
import com.company.listmanager.infrastructure.excel.ExcelParseResult;
import com.company.listmanager.infrastructure.excel.ExcelParser;
import com.company.listmanager.infrastructure.excel.ExcelRowData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UploadExcelUseCase {

    private static final Logger log = LoggerFactory.getLogger(UploadExcelUseCase.class);

    private final FileUploadRepositoryPort fileUploadRepository;
    private final EntryRepositoryPort entryRepository;
    private final ExcelParser excelParser;

    public UploadExcelUseCase(FileUploadRepositoryPort fileUploadRepository,
                              EntryRepositoryPort entryRepository, ExcelParser excelParser) {
        this.fileUploadRepository = fileUploadRepository;
        this.entryRepository = entryRepository;
        this.excelParser = excelParser;
    }

    public OperationResult<UploadSummary> execute(byte[] fileContent, String originalFilename, TipoLista tipoLista, String uploadedBy) {
        log.info("UploadExcelUseCase started: tipoLista={}, filename={}", tipoLista, originalFilename);

        String objectKey = "uploads/" + UUID.randomUUID() + "/" + sanitizeFilename(originalFilename);

        FileUpload fileUpload = new FileUpload();
        fileUpload.setTipoLista(tipoLista);
        fileUpload.setObjectKey(objectKey);
        fileUpload.setOriginalFilename(originalFilename);
        fileUpload.setUploadedBy(uploadedBy);
        fileUpload.setUploadedAt(Instant.now());
        fileUpload.setStatus(UploadStatus.CARGADO);
        fileUpload.setTotalRows(0);
        fileUpload.setInsertedRows(0);
        fileUpload.setRejectedRows(0);
        fileUpload = fileUploadRepository.save(fileUpload);

        ExcelParseResult parseResult = excelParser.parse(new ByteArrayInputStream(fileContent));
        List<ExcelRowData> validRows = parseResult.validRows();
        List<RowError> parseErrors = parseResult.errors();

        int inserted = 0;
        for (ExcelRowData row : validRows) {
            ListEntry entry = new ListEntry();
            entry.setTipoLista(tipoLista);
            entry.setNombresCompletos(row.getNombresCompletos());
            entry.setDni(row.getDni());
            entry.setPaisOrigen(row.getPaisOrigen());
            entry.setWallet(row.getWallet());
            entry.setOficioJustificacion(row.getOficioJustificacion());
            entry.setSourceType(SourceType.EXCEL);
            entry.setFileUploadId(fileUpload.getId());
            entryRepository.save(entry);
            inserted++;
        }

        int rejected = (int) parseErrors.stream().map(RowError::row).distinct().count();
        int totalRows = validRows.size() + rejected;
        fileUpload.setTotalRows(totalRows);
        fileUpload.setInsertedRows(inserted);
        fileUpload.setRejectedRows(rejected);
        fileUpload.setStatus(rejected > 0 ? UploadStatus.CON_ERRORES : UploadStatus.PROCESADO);
        if (!parseErrors.isEmpty()) {
            StringBuilder report = new StringBuilder();
            for (RowError e : parseErrors) {
                report.append("Fila ").append(e.row()).append(" ").append(e.column()).append(": ").append(e.message()).append("\n");
            }
            fileUpload.setErrorReport(report.toString());
        }
        fileUploadRepository.save(fileUpload);

        UploadSummary summary = new UploadSummary(totalRows, inserted, rejected, parseErrors);
        log.info("UploadExcelUseCase finished: inserted={}, rejected={}", inserted, rejected);
        return OperationResult.success(summary);
    }

    private String sanitizeFilename(String name) {
        if (name == null) return "upload.xlsx";
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    public record UploadSummary(int totalRows, int insertedRows, int rejectedRows, List<RowError> errors) {
        public UploadSummary(int totalRows, int insertedRows, int rejectedRows, List<RowError> errors) {
            this.totalRows = totalRows;
            this.insertedRows = insertedRows;
            this.rejectedRows = rejectedRows;
            this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
        }
    }
}
