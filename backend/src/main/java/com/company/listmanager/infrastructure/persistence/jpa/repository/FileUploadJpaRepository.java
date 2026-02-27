package com.company.listmanager.infrastructure.persistence.jpa.repository;

import com.company.listmanager.infrastructure.persistence.jpa.entity.FileUploadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FileUploadJpaRepository extends JpaRepository<FileUploadEntity, UUID> {
}
