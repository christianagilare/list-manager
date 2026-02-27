package com.company.listmanager.infrastructure.persistence.jpa.repository;

import com.company.listmanager.infrastructure.persistence.jpa.entity.ListEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ListEntryJpaRepository extends JpaRepository<ListEntryEntity, UUID> {
}
