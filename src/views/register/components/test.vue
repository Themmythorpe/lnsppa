try {
    const response = await axios.post('https://domainbackend.uniquenetsys.com/api/v1/register',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    this.registerForm)
    const responseData = response.data

    if (responseData.status) {

      this.$message.success(responseData.message)
    } else {

      this.$message.error(responseData.message)
    }
  } catch (error) {
    console.error('Error during registration:', error)
    this.$message.error('An error occurred during registration.')
  }
