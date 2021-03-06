import { ISize } from "../../interfaces/ISize";
import { Action } from "../Actions";
import { PopupWindowType } from "../../data/enums/PopupWindowType";
import { CustomCursorStyle } from "../../data/enums/CustomCursorStyle";
import { ContextType } from "../../data/enums/ContextType";
import { ProjectType } from "../../data/enums/ProjectType";
import { TicketType } from "../../data/enums/TicketType";

export type ProjectData = {
    projectId: string, //项目编号
    name: string,  //项目名称
    status: string, //项目状态 undone, done
    detail: [],  //项目的详细信息

    type: ProjectType; //项目类型
    ticketType: TicketType;//单据类型
}

export type GeneralState = {
    windowSize: ISize;
    activePopupType: PopupWindowType;
    customCursorStyle: CustomCursorStyle;
    preventCustomCursor: boolean;
    imageDragMode: boolean;
    activeContext: ContextType;
    projectData: ProjectData;
    zoom: number;
}

interface UpdateProjectData {
    type: typeof Action.UPDATE_PROJECT_DATA;
    payload: {
        projectData: ProjectData;
    }
}


interface UpdateWindowSize {
    type: typeof Action.UPDATE_WINDOW_SIZE;
    payload: {
        windowSize: ISize;
    }
}

interface UpdateActivePopupType {
    type: typeof Action.UPDATE_ACTIVE_POPUP_TYPE;
    payload: {
        activePopupType: PopupWindowType;
    }
}

interface UpdateCustomCursorStyle {
    type: typeof Action.UPDATE_CUSTOM_CURSOR_STYLE;
    payload: {
        customCursorStyle: CustomCursorStyle;
    }
}

interface UpdateActiveContext {
    type: typeof Action.UPDATE_CONTEXT;
    payload: {
        activeContext: ContextType;
    }
}

interface UpdatePreventCustomCursorStatus {
    type: typeof Action.UPDATE_PREVENT_CUSTOM_CURSOR_STATUS;
    payload: {
        preventCustomCursor: boolean;
    }
}

interface UpdateImageDragModeStatus {
    type: typeof Action.UPDATE_IMAGE_DRAG_MODE_STATUS;
    payload: {
        imageDragMode: boolean;
    }
}

interface UpdateZoom {
    type: typeof Action.UPDATE_ZOOM,
    payload: {
        zoom: number;
    }
}

export type GeneralActionTypes = UpdateProjectData
    | UpdateWindowSize
    | UpdateActivePopupType
    | UpdateCustomCursorStyle
    | UpdateActiveContext
    | UpdatePreventCustomCursorStatus
    | UpdateImageDragModeStatus
    | UpdateZoom