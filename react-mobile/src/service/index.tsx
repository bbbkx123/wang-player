import { get } from "./http"

/**
 * 获取喜欢音乐列表
 * @param {String, Number} uid 用户id
 */
export const getLikeList = (uid: number) => get("/likelist", { params: { uid } })

/**
 * 获取歌单详情
 * @param {String} id 歌单id @requires
 * @param {Number} s 歌单最近的 s 个收藏者
 *
 * response:
 *    trackIds是完整的id，tracks 则是不完整的
 */
export const fetchPlayListDetail = (id: string) => get("/playlist/detail", { params: { id } })

/**
 * 获取歌曲详情
 * @param {String} ids 歌曲id  ids=xxx,xxxx,...
 */
export const fetchSongsDetail = (ids: string) => get("/song/detail", { params: { ids } })

/**
 * 获取歌曲url
 * @param {String} id 歌曲id
 */
export const fetchSongUrl = (id: string) => get("/song/url", { params: { id } })

/**
 * banner
 * @param {Number} type 资源类型
 *
 */
export const fetchBanner = (type: number) => get("/banner", { params: { type } })

/**
 * 推荐歌单
 * @param {Number} limit 取出数量
 *
 */
export const fetchPersonalization = (limit: number) => get("/personalized", { params: { limit } })

/**
 * 推荐新音乐
 * @param {Number} limit 取出数量
 *
 */
export const fetchNewSong = (limit: number) => get("/personalized/newsong", { params: { limit } })

/**
 * 搜索
 * @param {String} keywords 关键字
 * @param {Number} limit 取出数量
 * @param {Number} offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 *
 * result:
 * bannerItem.targetType
 * 3000 网页跳转
 * 1004 mv
 * 1000 歌单
 * 1    歌曲
 * 10   专辑
 *
 */
export const getSearchResult = (keywords: string, limit: number, offset: number) => get("/search", { params: { keywords, limit, offset } })

/**
 * 歌曲评论
 * @param {String} id 音乐id(必填)
 * @param {Number} limit 评论数量
 * @param {Number} offset 偏移数量  用于分页  (评论页数 -1)*20, 其中 20 为 limit 的值
 * @param {Number} before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 *
 */
export const fetchMusicComment = (id:string, limit?:number, offset?:number, before?: Number) => get("/comment/music", { params: { id, limit, offset, before } })

/**
 * 获取歌词
 * @param id 歌曲id
 * @returns 
 */
export const fetchLyric = (id: string | number) => get("/lyric", {params: {id}})