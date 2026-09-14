export type SearchEntityType =
  | 'NOTES'
  | 'PYQ'
  | 'PASSING_PACKAGE'
  | 'VIDEO'
  | 'FORMULA_SHEET'
  | 'COMMUNITY_RESOURCE';

export type IndexingStatus = 'INDEXED' | 'OUT_OF_SYNC' | 'REMOVED_FROM_SEARCH' | 'INDEXING_FAILED';

export interface SearchIndexProjection {
  id: string;
  entityType: SearchEntityType;
  canonicalId: string;
  subjectCode: string; // e.g. "21MAT31"
  subjectName: string; // e.g. "Engineering Mathematics III"
  title: string;
  keywords: string[];
  aliases: string[]; // Synonyms & alternative search terms
  status: IndexingStatus;
  lastIndexedAt: string;
  documentScore: number;
}

export interface FailedIndexingJob {
  id: string;
  projectionId: string;
  entityTitle: string;
  entityType: SearchEntityType;
  errorMessage: string;
  timestamp: string;
  retryCount: number;
}
