import * as api from 'api'
import * as common from '../../base/util/common'

export default {
	methods: {
		getPlayListDetail (listid) {
			if (!listid) return null
			return new Promise((resolve, reject) => {
				try {
					api.getPlayListDetail(listid).then((res) => {
						if (res.data.code === 200) {
							let data = res.data.playlist
							let temp = {}
							let fields = ['tracks', 'coverImgUrl', 'name', 'creator', 'createTime']
							fields.forEach((field) => {
								temp[field] = data[field]
							})
							temp.tracks = common.songDetails(temp.tracks)
							resolve(temp)
						}
					})
				} catch (err) {
					reject(err)
				}
			})
		},
		getSongsDetail (ids) {
			return new Promise((resolve, reject) => {
				try {
					api.getSongsDetail(ids).then((res) => {
						if (res.data.code === 200) {
							resolve(common.songDetails(res.data.songs))
						}
					})
				} catch (err) {
					reject(err)
				}
			})
		}
	}
}
