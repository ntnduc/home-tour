import { BadGatewayException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseCreateDto } from '../dto/create.dto';
import { BaseDetailDto } from '../dto/detail.dto';
import { BaseEntity } from '../Entity/BaseEntity';
import { IBaseService } from './IService';

@Injectable()
export class BaseService<
  TEntity extends BaseEntity,
  TDetailDto extends BaseDetailDto<TEntity>,
  TCreateDto extends BaseCreateDto<TEntity>,
> implements IBaseService<TEntity, TDetailDto, TCreateDto>
{
  constructor(
    protected readonly genericRepository: Repository<TEntity>,
    protected readonly detailDto: new () => TDetailDto,
    protected readonly createDto: new () => TCreateDto,
  ) {}

  async create(dto: TCreateDto): Promise<TDetailDto> {
    try {
      const entity = dto.getEntity();
      const createdEntity = await this.genericRepository.save(entity);
      const detailDto = new this.detailDto();
      detailDto.fromEntity(createdEntity);
      return detailDto;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  // getAll(): Promise<T[]> {
  //   try {
  // 	return <Promise<T[]>>this.genericRepository.find();
  //   } catch (error) {
  // 	throw new BadGatewayException(error);
  // }
  // }

  // get(id: number): Promise<T> {
  // try {

  // } catch (error) {
  // 	throw new BadGatewayException(error);
  // }
  // 	return <Promise<T>>this.genericRepository.findOneById(id);
  // }

  // delete(id: number) {
  // try {
  // 	this.genericRepository.deleteById(id)
  // } catch (error) {
  // 	throw new BadGatewayException(error);
  // }
  // }

  // update(entity: any): Promise<any>{
  // try {
  // 	return new Promise<any> ((resolve, reject) => {
  // 		this.genericRepository.findOneById(entity.id)
  // 		.then(responseGet => {
  // 			try {
  // 				if (responseGet == null) reject('Not existing')
  // 				let retrievedEntity: any = responseGet as any
  // 				this.genericRepository.save(retrievedEntity)
  // 				.then(response => resolve(response))
  // 				.catch(err => reject(err))
  // 			}
  // 			catch(e) {
  // 					reject(e)
  // 			}
  // 		})
  // 		.catch(err => reject(err))
  // 		})
  // } catch (error) {
  // 	throw new BadGatewayException(error);
  // }
  // }
}
