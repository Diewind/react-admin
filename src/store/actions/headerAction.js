import {
    headerType
} from '../actionTypes/index'

class headerAction {
    // 设置头部标题的同步action
    setHeadTitle = (headTitle = '首页') => ({
        type:headerType['SET_HEAD_TITLE'],
        data:headTitle
    })
}

export default new headerAction();