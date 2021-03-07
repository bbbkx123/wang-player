import {get} from './http'

/**
 * 获取喜欢音乐列表
 * @param {String, Number} uid 用户id
 */
export const getLikeList = (uid: number) => get('/likelist', {params: {uid}})

/**
 * 获取歌单详情
 * @param {String} id 歌单id @requires
 * @param {Number} s 歌单最近的 s 个收藏者
 * 
 * response:
 *    trackIds是完整的id，tracks 则是不完整的
 */
export const fetchPlayListDetail = (id: string) => get('/playlist/detail', {params: {id}})

/**
 * 获取歌曲详情
 * @param {String} ids 歌曲id  ids=xxx,xxxx,...
 */
export const fetchSongsDetail = (ids: string) => get('/song/detail', {params: {ids}})

/**
 * 获取歌曲url
 * @param {String} id 歌曲id 
 */
export const fetchSongUrl = (id: string) => get('/song/url', {params: {id}})