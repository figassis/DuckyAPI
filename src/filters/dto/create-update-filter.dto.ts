import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { EachIsEmailOrHttpOrSmtp } from 'src/common/is-email-or-url.validator'

import { Filter } from '../class/filter.class'

class Query {
  @ApiProperty({
    example: 'John',
    description: 'Partial match for the From: header (case insensitive)',
    required: false,
  })
  @IsOptional()
  @IsString()
  public from?: string

  @ApiProperty({
    example: 'John',
    description: 'Partial match for the To:/Cc: headers (case insensitive)',
    required: false,
  })
  @IsOptional()
  @IsString()
  public to?: string

  @ApiProperty({
    example: 'You have 1 new notification',
    description: 'Partial match for the Subject: header (case insensitive)',
    required: false,
  })
  @IsOptional()
  @IsString()
  public subject?: string

  @ApiProperty({
    example: "John's list",
    description: 'Partial match for the List-ID: header (case insensitive)',
    required: false,
  })
  @IsOptional()
  @IsString()
  public listId?: string

  @ApiProperty({
    example: 'Dedicated servers',
    description: 'Fulltext search against message text',
    required: false,
  })
  @IsOptional()
  @IsString()
  public text?: string

  @ApiProperty({
    example: false,
    description: 'Does a message have to have an attachment or not',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsBoolean()
  public ha?: boolean | ''

  @ApiProperty({
    example: 1000,
    description:
      'Message size in bytes. If the value is a positive number then message needs to be larger, if negative then message needs to be smaller than abs(size) value',
    required: false,
    type: Number,
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsNumber()
  public size?: number | ''
}

class Action {
  @ApiProperty({
    example: true,
    description: 'If true then mark matching messages as Seen',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsBoolean()
  public seen?: boolean | ''

  @ApiProperty({
    example: true,
    description: 'If true then mark matching messages as Flagged',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsBoolean()
  public flag?: boolean | ''

  @ApiProperty({
    example: true,
    description: 'If true then do not store matching messages',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsBoolean()
  public delete?: boolean | ''

  @ApiProperty({
    example: true,
    description: 'If true then store matching messags to Junk Mail folder',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsBoolean()
  public spam?: boolean | ''

  @ApiProperty({
    example: '5a1c0ee490a34c67e266932c',
    description: 'Mailbox ID to store matching messages to',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  public mailbox?: string

  @ApiProperty({
    example: ['johndoe@example.com', 'smtp://mx.example.com:25', 'https://example.com'],
    description:
      'An array of forwarding targets. The value could either be an email address or a relay url to next MX server ("smtp://mx2.zone.eu:25") or an URL where mail contents are POSTed to',
    required: false,
    type: [String],
  })
  @IsOptional()
  @ValidateIf((object, value): boolean => value !== '')
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Validate(EachIsEmailOrHttpOrSmtp)
  public targets?: string[] | ''
}

export class CreateUpdateFilterDto extends Filter {
  @ApiProperty({ description: 'Rules that a message must match' })
  @ValidateNested()
  @IsDefined({ message: 'query should not be null or undefined. However, it can be empty' })
  @Type((): typeof Query => Query)
  public query: Query

  @ApiProperty({ description: 'Rules that a message must match' })
  @ValidateNested()
  @IsDefined({ message: 'action should not be null or undefined. However, it can be empty' })
  @Type((): typeof Action => Action)
  public action: Action
}
