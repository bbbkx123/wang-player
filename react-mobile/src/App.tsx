import React from "react";
import { Button, WhiteSpace } from "antd-mobile";

import Play from '@/views/Play'

const App = (props: any) => {

  return (
    <div>
      <Button>default</Button><WhiteSpace />
      <Play></Play>
    </div>
  )
}

export default App