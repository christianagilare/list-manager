package com.company.listmanager.api.dto.response;

import java.util.List;

public class UploadListResponse {
    private List<FileUploadMetadataResponse> content;
    private long totalElements;
    private int page;

    public UploadListResponse() {
    }

    public UploadListResponse(List<FileUploadMetadataResponse> content, long totalElements, int page) {
        this.content = content;
        this.totalElements = totalElements;
        this.page = page;
    }

    public List<FileUploadMetadataResponse> getContent() {
        return content;
    }

    public void setContent(List<FileUploadMetadataResponse> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }
}
