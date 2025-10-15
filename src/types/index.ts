export interface RegisterRequestData {
    username: string,
    email: string,
    password: string
}

export interface LoginResponseData {
    accessToken: string,
    avatarUrl: string
}

export interface UserInfoResponseData {
    uid: string,
    name: string,
    sex: string,
    email: string,
    registrationDate: Date,
    briefIntroduction: string,
    followersCount: number,
    myFollowersCount: number,
    avatarUrl: string
}

export interface UploadUserRequestBody {
    name: string,
    sex: string,
    briefIntroduction: string
}

export interface FilesRequestConditions {
    needPage: number
    currentVersion: number
    isFiltered: boolean
    filters: FilterFilesConditions | null
}

export interface FilterFilesConditions {
    searchTerm: string | null
    categoryCode: number | 0
    dateRange?: 'last24Hours' | 'last7Days' | 'last30Days' | 'last90Days' | '' | null
    order: 'uploadDateDesc' | 'uploadDateAsc' | 'collectionCountDesc' | 'collectionCountAsc' | '' | null
}

export interface FilePage {
    currentPage: number
    totalPages: number
    latestVersion: number
    pageSize: number
    results: FileListItem[]
}

export interface FileListItem {
    id: number
    headline: string
    category: string
    description: string
    uploadDate: string
    collectionCount: number
}

export interface DetailFile extends FileListItem {
    fileName: string
    size: string
    uploader: string
    introduce: string
    imgs: string[]
}

export interface Category {
    categoryCode: number
    categoryName: string
}


// upload modules
export interface FileInfoForm {
  headline: string
  categoryCode: number | 1
  fileName: string
  size: string
  description: string
  introduce: string
  display: boolean
}

export interface UploadPaths {
  filePath: string
  imgsPath: string
}
