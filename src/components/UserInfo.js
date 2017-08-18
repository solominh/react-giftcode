import React, { Component } from "react";
import Button from "material-ui/Button";
import Avatar from "material-ui/Avatar";
import Dialog, { DialogTitle } from "material-ui/Dialog";

import { withStyles } from "material-ui/styles";
import { loadFacebookSDKAsync } from "../utils";

import logo from "../logo.svg";

const styles = theme => ({
  app: {
    display: "flex",
    lineHeight: 1.5,
    margin: "0 auto"
  },
  userInfoContainer: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    alignItems: "stretch",
    backgroundColor: "yellow",
    padding: 10
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    // width: 500,
    justifyContent: "flex-start",
    marginLeft: 10
  },
  codeHighlight: {
    color: "red"
  },
  dialogContent: {
    textAlign: "center",
    color: "red"
  },
  avatarContainer: {
    display: "flex",
    alignItems: 'center',
    justifyContent:'center'
  },
  avatar: {
    width: 50,
    height: 50,
    padding: 10
  },
  button: {
    width: 300,
    marginBottom: 5
  }
});

class UserInfo extends Component {
  state = {
    shareTimes: localStorage.getItem("shareTimes") || 0,
    invitedFriendCount: localStorage.getItem("invitedFriendCount") || 0,
    name: undefined,
    avatar: undefined,
    showCodeLoanTinDialog: false,
    showCodeBangHuuDialog: false
  };

  componentDidMount() {
    loadFacebookSDKAsync().then(() => {
      window.FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
      });
    });
  }

  showAccountInfo() {
    window.FB.api("/me?fields=name,picture", response => {
      const { name, picture } = response;
      this.setState({
        name,
        avatar: picture.data.url
      });
    });
  }

  statusChangeCallback = response => {
    console.log(response);
    if (response.status !== "connected") return;
    this.showAccountInfo();
  };

  onBtnCheckPageLike = () => {
    window.FB.getLoginStatus(response => {
      console.log(response);
      if (response.status === "connected") {
        this.checkLikePage();
        return;
      }

      window.FB.login(
        response => {
          this.statusChangeCallback(response);
          if (response.status === "connected") {
            this.checkLikePage();
          } else {
            alert("Bạn cần đăng nhập để nhận code");
          }
        },
        { scope: "public_profile,email,user_friends,user_likes" }
      );
    });
  };

  checkLikePage = () => {
    window.FB.api("/me/likes/111635406210579", response => {
      console.log(response);
      if (response.data.length === 0) {
        alert("Bạn chưa like Fanpage");
      } else {
        alert("Code tân thủ: abcdefghijk123456");
      }
    });
  };

  onBtnShareClick = () => {
    window.FB.ui(
      {
        method: "share",
        href: window.location.href
      },
      response => {
        console.log(response);
        if (response.error_code) return;
        let prevShareTimes = localStorage.getItem("shareTimes") || 0;
        let shareTimes = parseInt(prevShareTimes) + 1;
        localStorage.setItem("shareTimes", shareTimes);
        this.setState({
          shareTimes,
          showCodeLoanTinDialog: true
        });
      }
    );
  };

  onBtnInviteClick = () => {
    // window.FB.api("/me/invitable_friends", response => {
    //   console.log(response);
    //   const friends = [
    //     { name: "name a", id: 1 },
    //     { name: "name b", id: 2 },
    //     { name: "name c", id: 3 }
    //   ];

    //   this.setState({
    //     showSelectFriendsDialog: true,
    //     friends
    //   });
    // });

    window.FB.ui(
      {
        method: "apprequests",
        message: "YOUR_MESSAGE_HERE"
      },
      response => {
        console.log("apprequest", response);

        if (Array.isArray(response) && response.length === 0) return;

        let invitedFriendCount = response.to.length;
        let prevInvitedFriendCount =
          localStorage.getItem("invitedFriendCount") || 0;
        let newInvitedFriendCount =
          parseInt(prevInvitedFriendCount) + invitedFriendCount;
        localStorage.setItem("invitedFriendCount", newInvitedFriendCount);

        const shouldShowCodeBangHuu =
          prevInvitedFriendCount < 5 && newInvitedFriendCount >= 5;
        this.setState({
          invitedFriendCount: newInvitedFriendCount,
          showCodeBangHuuDialog: shouldShowCodeBangHuu
        });
      }
    );
  };

  handleRequestClose = () => {
    this.setState({
      showCodeLoanTinDialog: false
    });
  };

  onCodeBangHuuDialogClose = () => {
    this.setState({
      showCodeBangHuuDialog: false
    });
  };

  render() {
    const classes = this.props.classes;
    const { shareTimes, invitedFriendCount, name, avatar } = this.state;
    const userInfo = `Chào đại hiệp ${name
      ? name
      : ""}, bạn đã: chia sẻ ${shareTimes} lần, mời ${invitedFriendCount} bạn.`;

    return (
      <div className={classes.app}>
        <div className={classes.userInfoContainer}>
          <div className={classes.avatarContainer}>
            <span>{!avatar ? "No login status" : ""}</span>{" "}
            <Avatar className={classes.avatar} src={avatar ? avatar : logo} />
          </div>
          <div>
            {userInfo}
          </div>
          <div>
            Thích Fanpage{" "}
            <span className={classes.codeHighlight}>Nhận code Tân binh</span>
          </div>
          <div>
            Chia sẻ Fanpage{" "}
            <span className={classes.codeHighlight}>Nhận code Loan tin</span>
          </div>
          <div>
            Mời 5 bạn{" "}
            <span className={classes.codeHighlight}>Nhận code Bằng hữu</span>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            raised
            color="primary"
            onClick={this.onBtnCheckPageLike}
          >
            Nhận Giftcode tân thủ
          </Button>
          <Button
            className={classes.button}
            raised
            color="primary"
            onClick={this.onBtnShareClick}
          >
            Nhận Giftcode share
          </Button>
          <Button
            className={classes.button}
            raised
            color="primary"
            onClick={this.onBtnInviteClick}
          >
            Nhận Giftcode mời bạn
          </Button>
        </div>
        <Dialog
          open={this.state.showCodeLoanTinDialog}
          onRequestClose={this.handleRequestClose}
        >
          <DialogTitle>Code Loan Tin</DialogTitle>
          <div className={classes.dialogContent}>codeloantin123</div>
        </Dialog>

        <Dialog
          open={this.state.showCodeBangHuuDialog}
          onRequestClose={this.onCodeBangHuuDialogClose}
        >
          <DialogTitle>Code Bằng Hữu</DialogTitle>
          <div className={classes.dialogContent}>codebanghuu123</div>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(UserInfo);
