using System;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Posts;
using Modules.Posts.Dtos;
using Modules.Posts.Extensions;

namespace API.Controllers
{
	public class PostController : BaseApiController
	{
		public IMediator _mediator { get; set; }
		public PostController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpGet]
		public async Task<IActionResult> GetPostList([FromQuery] PostQueryParams param)
		{
			// return HandlePagedResult(await Mediator.Send(new ListAllPosts.Query { PostQueryParams = param }));
			return HandleResult(await Mediator.Send(new ListAllPosts.Query { PostQueryParams = param }));
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetAPost(Guid id)
		{
			return HandleResult(await Mediator.Send(new GetPost.Query { Id = id }));
		}

		[HttpPost]
		public async Task<IActionResult> CreatePost([FromBody] CreatePostParams createPostParams)
		{
			return HandleResult(await Mediator.Send(new CreatePost.Command { NewPostParams = createPostParams }));
		}

		[Authorize(Policy = "IsPostOwner")]
		[HttpPut("edit/{id}")]
		public async Task<IActionResult> EditPost(Guid id, [FromBody] EditPostDto post)
		{
			return HandleResult(await Mediator.Send(new EditPost.Command { Post = post }));
		}
	}
}