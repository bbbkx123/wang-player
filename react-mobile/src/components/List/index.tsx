import "./index.less"

const List = (props: any) => {
  const { data, mode, onTouchStart, onTouchEnd } = props
  const config = {onTouchStart, onTouchEnd}

  return (
    <>
      {data &&
        data.map((item: any, index: number) => {
          Object.assign(config, {item, key: `${mode}-${index}`, index})
          if (mode === "PLAY_LIST") {
            return <PlayListStyle {...config}/>
          } else if (mode === "NEW_SONG") {
            return <NewSongListStyle {...config}></NewSongListStyle>
          } else if (mode === "MINI_LIST") {
            return <MiniListStyle {...config}></MiniListStyle>
          } else if (mode === "COMMENT_LIST") {
            return <CommentListStyle {...config}></CommentListStyle>
          }
          return 
        })}
    </>
  )
}

const PlayListStyle = (props: any) => {
  const {index, item, onTouchStart, onTouchEnd} = props
  return (
    <div
      className="song-item play-list"
      key={`song-item1-${index}`}
      onTouchStart={onTouchStart}
      onTouchEnd={() => onTouchEnd(index, item.sid)}
    >
      <div className="index">{index + 1}</div>
      <div className="main">
        <div className="song-name">{item.name}</div>
        <div className="other-info">
          <span className="info">{`${item.artist} - ${item.album.name}`}</span>
          <span>{}</span>
        </div>
      </div>
      <div className="edit"></div>
    </div>
  )
}

const NewSongListStyle = (props: any) => {
  const {item, index, onTouchStart, onTouchEnd} = props
  return (
    <div
      className="song-item new-song"
      onTouchStart={onTouchStart}
      onTouchEnd={() => onTouchEnd(index)}
    >
      <div className="pic">
        <img src={item.picUrl} alt=""/>
      </div>
      <div className="main">
        <div className="song-name"><span>{`${item.name} - `}</span><span style={{fontSize: "10px", color: "rgba(255,255,255, .5)"}}>{`${item.artistsNames}`}</span></div>
        <div className="other-info">
          <span className="info">{item.albumName || "albumName - albumName - albumName"}</span>
        </div>
      </div>
    </div>
  )
}

const MiniListStyle = (props: any) => {
  const {item, index, onTouchStart, onTouchEnd} = props
  return (
    <div
      className="song-item mini-list"
      onTouchStart={onTouchStart}
      onTouchEnd={() => onTouchEnd(index)}
    >
      <div className="main">
        <div className="song-name">{`${item.name} - ${item.album.name}`}</div>
        <div className="edit"></div>
      </div>
    </div>
  )
}


const CommentListStyle = (props: any) => {
  const {item, index, onTouchStart, onTouchEnd} = props
  return (
    <div className="comment-item-container">
        <div className="avatar-container">
          <div className="avatar" style={{backgroundImage: `url(${item.user.avatarUrl}?param=35y35)`}}></div>
        </div>
        <div className="comment-item-main-container">
          <div className="comment">
            <span className="nickname">{`${item.user.nickname} : `}</span>
          {item.content}
          </div>
          <div className="other">
            <div className="time">{item.time}</div>
            <div className="like">
              <i className="iconfont icon-dianzan"></i>({item.likedCount})
            </div>
          </div>
        </div>
      </div>
  )
}

export default List
