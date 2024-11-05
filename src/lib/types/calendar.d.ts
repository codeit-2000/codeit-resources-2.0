/**
 *
 * (참고)
 *
 * 회의실(리소스)은 개별 캘린더로 취급됩니다.
 * 특정 이벤트에 회의실을 할당하고 싶다면, 참여자 필드에 회의실을 추가함으로써 할당할 수 있습니다.
 *
 */

/**
 * 캘린더 목록을 나타내는 인터페이스
 */
export interface CalendarList {
  /** 리소스 유형을 나타내는 문자열. 예: "calendar#calendarList" */
  kind: string;
  /** 리소스 버전 정보를 제공하는 문자열 */
  etag: string;
  /** 다음 동기화에 사용할 수 있는 토큰 (선택적) */
  nextSyncToken?: string;
  /** CalendarListEntry 객체의 배열 */
  items: CalendarListEntry[];
}

/**
 * 개별 캘린더 항목을 나타내는 인터페이스
 */
export interface CalendarListEntry {
  /** 리소스 유형을 나타내는 문자열. 예: "calendar#calendarListEntry" */
  kind: string;
  /** 항목 버전 정보를 제공하는 문자열 */
  etag: string;
  /** 캘린더의 고유 식별자 */
  id: string;
  /** 캘린더의 요약(이름) */
  summary: string;
  /** 캘린더에 대한 설명 (선택적) */
  description?: string;
  /** 캘린더의 표준 시간대. 예: Asia/Seoul */
  timeZone: string;
  /** 캘린더에 지정된 색상의 ID */
  colorId: string;
  /** 캘린더의 배경 색상 */
  backgroundColor: string;
  /** 캘린더의 텍스트 색상 */
  foregroundColor?: string;
  /** 사용자가 이 캘린더를 선택했는지를 나타내는 불리언 값 */
  selected: boolean;
  /** 사용자의 캘린더 접근 권한을 나타내는 문자열 (예: "owner", "reader", "writer") */
  accessRole: string;

  /** 사용하지 않을 것 같은 속성은 표기하지 않았음 */
  [key: string]: unknown;
}

/**
 * 알림 설정을 나타내는 인터페이스
 */
export interface Reminder {
  /** 알림 방법을 나타내는 문자열 (예: "email", "popup") */
  method: string;
  /** 알림이 발생하기 전의 분 수 */
  minutes: number;
}

/**
 * 캘린더의 알림 설정을 나타내는 인터페이스
 */
export interface NotificationSettings {
  /** 알림 설정을 포함하는 Notification 객체의 배열 */
  notifications: Notification[];
}

/**
 * 개별 알림을 나타내는 인터페이스
 */
export interface Notification {
  /** 알림의 유형을 나타내는 문자열 (예: "eventCreation", "eventChange") */
  type: string;
  /** 알림을 받을 방법을 나타내는 문자열 (예: "email", "sms") */
  method: string;
}

/**
 * Google Calendar의 이벤트를 나타내는 인터페이스
 */
export interface Event {
  /** 리소스 유형을 나타내는 문자열. 예: "calendar#event" */
  kind: string;
  /** 항목 버전 정보를 제공하는 문자열 */
  etag: string;
  /** 생성된 이벤트의 고유 식별자 */
  id: string;
  /** 이벤트의 제목을 나타내는 문자열 */
  summary: string;
  /** 이벤트에 대한 설명을 나타내는 문자열 */
  description: string;
  /** 이벤트 위치 */
  location: string;

  /** 이벤트 시작 정보를 포함하는 객체 */
  start: {
    /** 날짜 형식 (일정이 종일일 경우 사용) */
    date?: string;
    /** 날짜 및 시간 형식 (일반 일정일 경우 사용) */
    dateTime?: string;
    /** 시간대 정보 */
    timeZone: string;
  };
  /** 이벤트 종료 정보를 포함하는 객체 */
  end: {
    /** 날짜 형식 (일정이 종일일 경우 사용) */
    date?: string;
    /** 날짜 및 시간 형식 (일반 일정일 경우 사용) */
    dateTime?: string;
    /** 시간대 정보 */
    timeZone: string;
  };

  /** 이벤트의 상태, 예: "accepted", "tentative", "declined" , "needsAction" */
  status: string;

  /** 이벤트 작성자 정보 */
  creator: {
    /** 작성자의 고유 ID */
    id?: string;
    /** 작성자의 이메일 주소 */
    email?: string;
    /** 작성자의 표시 이름 */
    displayName?: string;
    /** 이벤트 작성자가 자신인 경우 true */
    self?: boolean;
  };

  /** 이벤트 주최자 정보 */
  organizer: {
    /** 주최자의 고유 ID */
    id?: string;
    /** 주최자의 이메일 주소 */
    email?: string;
    /** 주최자의 표시 이름 */
    displayName?: string;
    /** 주최자가 자신인 경우 true */
    self?: boolean;
  };

  /** 이벤트 참석자 목록 */
  attendees?: Array<{
    /** 참석자의 고유 ID */
    id?: string;
    /** 참석자의 이메일 주소 */
    email?: string;
    /** 참석자의 표시 이름 */
    displayName?: string;
    /** 참석자가 주최자인 경우 true */
    organizer?: boolean;
    /** 참석자가 자신인 경우 true */
    self?: boolean;
    /** 참석자가 리소스인 경우 true */
    resource?: boolean;
    /** 선택적 참석자인 경우 true */
    optional?: boolean;
    /** 참석자의 응답 상태: "accepted", "declined", "tentative", "needsAction" */
    responseStatus?: string;
    /** 참석자의 코멘트 */
    comment?: string;
    /** 참석자가 추가로 초대한 게스트 수 */
    additionalGuests?: number;
  }>;

  /** 웹에서 이벤트를 볼 수 있는 URL 링크 */
  htmlLink: string;

  /** 게스트가 다른 사람을 초대할 수 있는지 여부, 기본값 true */
  guestsCanInviteOthers?: boolean;
  /** 게스트가 이벤트를 수정할 수 있는지 여부, 기본값 false */
  guestsCanModify?: boolean;
  /** 게스트가 다른 참석자를 볼 수 있는지 여부, 기본값 true */
  guestsCanSeeOtherGuests?: boolean;

  /** 알림 설정 */
  reminders?: {
    /** 기본 알림을 사용할지 여부 */
    useDefault: boolean;
    /** 사용자 지정 알림 목록 */
    overrides?: Array<{
      /** 알림 방법, 예: "email", "popup" */
      method: string;
      /** 알림 시간 (분) */
      minutes: number;
    }>;
  };
}

/**
 * 이벤트 요청 객체
 */
export type EventRequest = Partial<
  Pick<
    Event,
    "id" | "description" | "location" | "status" | "organizer" | "attendees"
  >
> &
  Pick<Event, "summary" | "start" | "end" | "creator">;

/**
  {
    "summary": "회의 제목",
    "start": {
      "dateTime": "2024-11-06T03:00:00-08:00",
      "timeZone": "Asia/Seoul"
    },
    "end": {
      "dateTime": "2024-11-06T03:00:00-08:00",
      "timeZone": "Asia/Seoul"
    },
    "attendees": [
      {
        "email": "c_1880l1li4dikehesi178q5s3pfn4a@resource.calendar.google.com",
        "resource": true,
      },
      {
        "email": "eprnf21@dev.resource.codeit.kr",
        "organizer": true,
        "responseStatus": "accepted"
      },
      {
        "email": "leejihyun0324@dev.resource.codeit.kr"
      }
    ],
    "reminders": {
      "useDefault": true
    }
  }
*/

/**
 * Google Calendar API의 이벤트 목록 응답 형식을 정의하는 인터페이스
 */
export interface EventList {
  /**
   * 리소스 유형을 나타냅니다. 이벤트 목록에서는 항상 'calendar#events'로 반환됩니다.
   */
  kind: "calendar#events";
  etag: string;
  summary: string;
  description?: string;
  updated: string; // RFC3339 형식의 datetime
  timeZone: string;
  /**
   * 사용자 캘린더에 대한 접근 권한입니다.
   * - 예: 'owner', 'reader', 'writer', 'freeBusyReader'
   */
  accessRole: string;

  /**
   * 기본 알림 설정으로, 각 알림의 메소드와 시간을 정의합니다.
   */
  defaultReminders: Array<{
    /**
     * 알림 방식입니다 (예: 'email', 'popup').
     */
    method: string;

    /**
     * 이벤트 시작 전 알림이 울리는 시간 (분)입니다.
     */
    minutes: number;
  }>;

  /**
   * 결과의 다음 페이지를 가져오는 데 사용할 토큰입니다.
   * 페이징 처리에 사용됩니다.
   */
  nextPageToken?: string;

  /**
   * 증분 동기화 토큰으로, 이후 변경 사항을 동기화할 때 사용됩니다.
   */
  nextSyncToken?: string;

  /**
   * 반환된 이벤트의 배열입니다. 각 이벤트는 events 리소스를 따릅니다.
   */
  items: Array<Event>;
}

/**
 * Google Calendar API 이벤트 리스트 요청을 위한 파라미터 타입 정의
 */
export interface CalendarEventListParams {
  /**
   * 캘린더 식별자입니다. 'primary'로 설정 시 현재 로그인된 사용자의 기본 캘린더에 액세스합니다.
   */
  calendarId: string;

  /**
   * 지원 중단된 옵션으로 무시됩니다.
   */
  alwaysIncludeEmail?: boolean;

  /**
   * 반환할 이벤트 유형입니다. 여러 번 반복하여 다양한 유형의 이벤트를 반환할 수 있습니다.
   * - 'default': 일반 이벤트
   * - 'focusTime': 방해 금지 시간
   * - 'fromGmail': Gmail 포함 일정
   * - 'outOfOffice': 부재중 일정
   * - 'workingLocation': 근무 위치 일정
   */
  eventTypes?: string[];

  /**
   * iCalendar 형식의 이벤트 ID로 검색합니다.
   */
  iCalUID?: string;

  /**
   * 응답에 포함할 최대 참석자 수입니다. 초과 시 일부 참석자는 제외됩니다.
   */
  maxAttendees?: number;

  /**
   * 한 페이지에 반환할 최대 이벤트 수로, 최대 2,500개까지 설정 가능합니다.
   */
  maxResults?: number;

  /**
   * 결과 이벤트 정렬 기준입니다.
   * - 'startTime': 시작 시간 기준
   * - 'updated': 마지막 수정 시간 기준
   */
  orderBy?: "startTime" | "updated";

  /**
   * 반환할 결과 페이지를 지정하는 토큰입니다.
   */
  pageToken?: string;

  /**
   * 개인 확장 속성 필터로, 'propertyName=value' 형식입니다.
   */
  privateExtendedProperty?: string[];

  /**
   * 자유 텍스트 검색어로 이벤트와 일치하는 항목을 필터링합니다.
   */
  q?: string;

  /**
   * 공유 확장 속성 필터로, 'propertyName=value' 형식입니다.
   */
  sharedExtendedProperty?: string[];

  /**
   * 삭제된 이벤트를 결과에 포함할지 여부입니다.
   */
  showDeleted?: boolean;

  /**
   * 숨겨진 초대를 결과에 포함할지 여부입니다.
   */
  showHiddenInvitations?: boolean;

  /**
   * 반복 일정을 개별 인스턴스로 확장하여 반환할지 여부입니다.
   */
  singleEvents?: boolean;

  /**
   * 증분 동기화 토큰으로, 이전 요청 이후 변경된 항목만 포함합니다.
   */
  syncToken?: string;

  /**
   * 이벤트 시작 시간의 상한값 (제외)으로 필터링합니다.
   */
  timeMax?: string;

  /**
   * 이벤트 종료 시간의 하한값 (제외)으로 필터링합니다.
   */
  timeMin?: string;

  /**
   * 응답 시간대입니다. 기본적으로 캘린더의 시간대가 사용됩니다.
   */
  timeZone?: string;

  /**
   * 마지막 수정 시간 이후로 변경된 이벤트만 필터링하여 포함합니다.
   */
  updatedMin?: string;
}
