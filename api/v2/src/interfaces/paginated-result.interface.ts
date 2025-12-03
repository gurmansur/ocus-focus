/**
 * Interface for paginated results
 * @template T Type of items in the paginated results
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: {
    /**
     * Total number of items
     */
    totalItems: number;
    
    /**
     * Number of items in current page
     */
    itemCount: number;
    
    /**
     * Items per page
     */
    itemsPerPage: number;
    
    /**
     * Total number of pages
     */
    totalPages: number;
    
    /**
     * Current page number (0-indexed)
     */
    currentPage: number;
  };
} 