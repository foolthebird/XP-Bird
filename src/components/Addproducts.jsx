import axios from 'axios'
import React, { useState } from 'react'

const Addproducts = () => {
   const[loading,setLoading]=useState("")
  const[error,setError]=useState("")
  const[success,setSucces]=useState("")

  const[productname,setProductname]=useState("")
  const[description,setDescription]=useState("")
  const[cost,setCost]=useState("")
  const[productcategory,setProductcategory]=useState("")
  const[productphoto,setProductphoto]=useState("")


  const submit = async (e) => {
    e.preventDefault()
    setLoading("Please wait as we reload the webpage")

    try {
      const data = new FormData()

      data.append("product_name",productname)
      data.append("product_description",description)
      data.append("product_cost",cost)
      data.append("product_category",productcategory)
      data.append("product_photo",productphoto)

      const response = await axios.post("https://johnson.alwaysdata.net/api/add_product", data)
      setLoading("")
      setSucces(response.data.message)

      setProductname("")
      setDescription("")
      setCost("")
      setProductcategory("")
      setProductphoto("")
    } catch (error) {
      setLoading("")
      setError(error.message)
      
    }

  }

  return (
   <div className='auth-page-bg d-flex justify-content-center align-items-center py-5 min-vh-100'>
    <div className='col-md-8 glass-form-card p-5'>
        <h1 className="auth-title mb-4">Add Product</h1>
        
        <form onSubmit={submit}>
            {loading}
            {error}
            {success}
            
            <div className="form-group mb-3">
                <label className='glass-label'>Product Name</label>
                <input type="text" 
                    className='glass-input' 
                    onChange={(e)=> setProductname(e.target.value)} 
                    value={productname}
                /> 
            </div>

            <div className="form-group mb-3">
                <label className='glass-label'>Description</label>
                <textarea name="text" id="description" 
                    className='glass-input glass-textarea' 
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></textarea>
            </div>

            <div className="form-group mb-3">
                <label className='glass-label'>Cost (Ksh)</label>
                <input type="number" 
                    className='glass-input'
                    onChange={(e) => setCost(e.target.value)}
                    value={cost}
                />
            </div>

            <div className="form-group mb-3">
                <label className='glass-label'>Product Category</label>
                <input type="text"
                    className='glass-input'
                    onChange={(e) => setProductcategory(e.target.value)}
                    value={productcategory}
                    placeholder='e.g. Electronics, Clothing, Food'
                />
            </div>

            <div className="form-group mb-4">
                <label className='glass-label'>Product Photo</label>
                <div className="custom-file-upload">
                    <input type="file" accept='image/*' 
                        className='glass-file-input' 
                        onChange={(e) => setProductphoto(e.target.files[0])}
                    />
                </div>
            </div>

            <button type='submit' className='neon-action-btn w-100 mt-2'>
                Add Product
            </button>
        </form>
    </div>
</div>
  )
}

export default Addproducts