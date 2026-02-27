package com.company.listmanager.api.controller;

import com.company.listmanager.api.dto.request.CreateEntryRequest;
import com.company.listmanager.api.dto.response.EntryResponse;
import com.company.listmanager.api.mapper.EntryMapper;
import com.company.listmanager.application.usecase.CreateEntryUseCase;
import com.company.listmanager.domain.model.ListEntry;
import com.company.listmanager.domain.model.TipoLista;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/entries")
@Tag(name = "Entries", description = "Alta manual y búsqueda")
public class EntryController {

    private final CreateEntryUseCase createEntryUseCase;
    private final EntryMapper entryMapper;

    public EntryController(CreateEntryUseCase createEntryUseCase, EntryMapper entryMapper) {
        this.createEntryUseCase = createEntryUseCase;
        this.entryMapper = entryMapper;
    }

    @PostMapping("/{tipoLista}")
    @Operation(summary = "Alta manual")
    public ResponseEntity<EntryResponse> create(@PathVariable TipoLista tipoLista, @Valid @RequestBody CreateEntryRequest request) {
        ListEntry saved = createEntryUseCase.execute(
                tipoLista,
                request.getNombresCompletos(),
                request.getDni(),
                request.getPaisOrigen(),
                request.getWallet(),
                request.getOficioJustificacion()
        );
        return ResponseEntity.ok(entryMapper.toResponse(saved));
    }
}
