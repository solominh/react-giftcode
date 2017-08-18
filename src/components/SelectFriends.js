import React, { Component } from "react";

class SelectFriends extends Component {
  render() {
    return (
      <div>
        {this.props.friends.map(friend => {
          return (
            <div key={friend.id}>
              <label>
                <input type="checkbox" name={friend.name} value={friend.id} />
                {friend.name}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectFriends;
