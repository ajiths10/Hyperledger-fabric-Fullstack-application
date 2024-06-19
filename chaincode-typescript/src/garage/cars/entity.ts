import { Object, Property } from "fabric-contract-api";

@Object()
export class Cars {
  @Property()
  public ID!: string;

  @Property()
  public Model!: string;

  @Property()
  public Color!: string;

  @Property()
  public Owner!: string;

  @Property()
  public Year!: number;

  @Property()
  public VIN!: string; // Vehicle Identification Number

  @Property()
  public EngineType!: string;

  @Property()
  public Mileage!: number;

  @Property()
  public Note?: string | undefined;
}
