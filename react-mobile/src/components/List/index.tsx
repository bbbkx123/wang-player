import "./index.less"

const List = (props: any) => {
  const { data, mode, onTouchStart, onTouchEnd } = props
  return (
    <>
      {data &&
        data.map((item: any, index: number) => {
          if (mode === "PLAY_LIST") {
            return <PlayListStyle item={item} key={`song-item1-${index}`} index={index} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}/>
          } else if (mode === "NEW_SONG") {
            return <NewSongListStyle item={item}  key={`song-item2-${index}`} index={index} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></NewSongListStyle>
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
      onTouchEnd={() => onTouchEnd(index)}
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

export default List
