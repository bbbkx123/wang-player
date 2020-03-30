import axios from 'axios'

/**
 * 获取喜欢音乐列表
 * @param {String, Number} uid 用户id
 */
export const getLikeList = (uid) => axios.get('/likelist', {params: {uid}})

/**
 * 获取歌曲详情
 * @param {String} ids 歌曲id  ids=xxx,xxxx,...
 */
export const getSongsDetail = (ids) => axios.get('/song/detail', {params: {ids}})

/**
 * 登录
 * @param {String} phone 
 * @param {String} password 
 */
export const login = (phone, password) => axios.get('/login/cellphone', {params: {password, phone}})

/**
 * 用户歌单列表
 * @param {String} uid 用户id
 */
export const getPlayList = (uid) => axios.get('/user/playlist', {params: {uid}})

/**
 * 获取歌曲url
 * @param {String} id 歌曲id 
 */
export const getSongUrl = (id) => axios.get('/song/url', {params: {id}})

/**
 * 获取歌单详情
 * @param {String} id 歌单id
 * @param {Number} s 歌单最近的 s 个收藏者 (可选)
 * 
 * response:
 *    trackIds是完整的id，tracks 则是不完整的
 */
export const getPlayListDetail = (id) => axios.get('/playlist/detail', {params: {id}})

/**
 * 获取歌词
 * @param {String} id 歌曲id
 * 
 */
export const getLyric = (id) => axios.get('/lyric', {params: {id}})

/**
 * 推荐歌单
 * @param {Number} limit 取出数量
 * 
 */
export const getPersonalized = (limit) => axios.get('/personalized', {params: {limit}})

/**
 * banner
 * @param {Number} type 资源类型
 * 
 */
export const getBanner = (type) => axios.get('/banner', {params: {type}})

/**
 * 搜索
 * @param {Number} keywords 关键字
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
export const getSearchResult = (keywords, limit, offset) => axios.get('/search', {params: {keywords, limit, offset}})

/**
 * 获取精品歌单
 * @param {Number} before 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 * @param {Number} limit 取出数量
 * @param {Object}  cat   tag: ["华语", "古风", ....]
 * 
 */
export const getTopPlayList = (before, limit, cat) => axios.get('/top/playlist/highquality', {params: {before, limit, cat}})

/**
 * 歌单分类
 * 
 */
export const getPlayListCatList = () => axios.get('/playlist/catlist')

/**
 * 歌曲评论
 * @param {String} id 音乐id(必填) 
 * @param {Number} limit 评论数量
 * @param {Number} offset 偏移数量  用于分页  (评论页数 -1)*20, 其中 20 为 limit 的值
 * @param {Number} before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 * 
 */
export const getMusicComment = (id, limit, offset, before) => axios.get('/comment/music', {params: {id, limit, offset, before}})
