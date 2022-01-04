import React, { Component } from 'react';
import axios from 'axios';
// const Categories = () => {
//   const [cat, setCat] = useState("");
//   useEffect(() => {
//     axios.get('https://store.squarepakistan.com/public/api/Categories', { crossdomain: true })
//       .then(function (response) {
//         const data = response.data.data;
//         setCat(data);
//         console.log(data);
//         return data;
//       })
//   }, [])
//   return (
//     <>
//       {cat.map(()=>{

//       })}
//     </>
//   )
// }
// export default Categories;


class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    axios.get('https://store.squarepakistan.com/public/api/Categories', { crossdomain: true })
      .then(function (response) {
        const data = response.data.data;
        this.setState({ data: data });
        console.log(data);
      }.bind(this))
  }
  render() {
    return <div>
      {
        this.state.data.map((myData, i) => {
          return (
            <div>{myData.id}</div>
          )
        })
      }
    </div>;
  }
}

export default Categories;
