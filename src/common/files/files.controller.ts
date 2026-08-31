import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Upload Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Get a product image by filename' })
  @ApiParam({
    name: 'imageName',
    description:
      'Image file name with extension (e.g. 1740176-00-A_0_2000.jpg)',
    example: '1740176-00-A_0_2000.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested image file',
  })
  @ApiResponse({
    status: 400,
    description: 'Image not found',
  })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @ApiOperation({ summary: 'Upload a product image file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product image file (jpg, jpeg, png - max 5MB)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully, returns secure public URL',
    schema: {
      type: 'object',
      properties: {
        secureUlr: {
          type: 'string',
          example:
            'http://localhost:3000/api/v1/files/product/d5c2be6d-2e23-41bb-83df-211ff12e2c04.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (file missing or invalid format)',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    const secureUlr = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUlr };
  }
}
