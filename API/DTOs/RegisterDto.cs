using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
	public class RegisterDto
	{
		[Required]
		public string DisplayName { get; set; }
		[Required]
		public string Email { get; set; }
		[Required]
		// [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be more complex.")]
		[RegularExpression("(?=.*\\d)(?=.*[a-z]).{4,8}$", ErrorMessage = "Password must be more complex.")]
		public string Password { get; set; }
		[Required]
		public string UserName { get; set; }
	}
}
