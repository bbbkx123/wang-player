interface Lyric {
  timeList: any[];
  lyricList: any[];
  tLyricList: any[];
}

declare interface PlayPageState {
  lyric: Lyric;
  currentLyricLine: number;
  songId: string;
  isProgressChanging: boolean;
  percent: number;
}