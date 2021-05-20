class Loading {
  loadingWrapper: any
  tipLabel: string
  type: number
  wrap: any

  constructor(config: any) {
    const { tipLabel, type, wrap } = config
    this.tipLabel = tipLabel
    this.type = type
    this.wrap = wrap || document.getElementById("root")
  }
  init() {
    this.createDom()
  }

  hide() {
    this.wrap.removeChild(this.loadingWrapper)
  }

  createDom() {
    // loading wrap的子盒子，即整个loading的内容盒子
    const loadingWrapper = document.createElement("div")
    loadingWrapper.className = "loading-wrapper"
    // loading type对应的不同的动画
    const loadingView = document.createElement("div")
    loadingView.className = "loading-view"
    // loading 内的文本标签
    const tipView = document.createElement("div")
    tipView.className = "tip-view"
    tipView.innerText = this.tipLabel
    // 对 loading type的三种情形进行判断
    switch (this.type) {
      case 1:
        html = `
                <div class="container1">
                    <div class="circle circle1"></div>
                    <div class="circle circle2"></div>
                    <div class="circle circle3"></div>
                    <div class="circle circle4"></div>
                </div>
                <div class="container2">
                    <div class="circle circle1"></div>
                    <div class="circle circle2"></div>
                    <div class="circle circle3"></div>
                    <div class="circle circle4"></div>
                </div>
            `
        loadingView.innerHTML = html
        break
      case 2:
        var html = `
                <div class="bounce-view">
                    <div class="bounce bounce1"></div>
                    <div class="bounce bounce2"></div>
                    <div class="bounce bounce3"></div>
                </div>
           `
        loadingView.innerHTML = html
        break
      case 3:
        var html = `
                <div class="wave">
                    <div class="react react1"></div>
                    <div class="react react2"></div>
                    <div class="react react3"></div>
                    <div class="react react4"></div>
                    <div class="react react5"></div>
                </div>
           `
        loadingView.innerHTML = html
        break
      default:
        break
    }
    

    loadingWrapper.appendChild(loadingView)
    loadingWrapper.appendChild(tipView)

    const mask = document.createElement('div')
    mask.classList.add('loading-mask')
    mask.appendChild(loadingWrapper)

    this.wrap.appendChild(mask)
    this.loadingWrapper = mask
  }
}

export default Loading
